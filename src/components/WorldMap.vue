<script setup>
import { ref, shallowRef, computed, onMounted } from "vue";
import { geoNaturalEarth1, geoPath, geoGraticule10, zoom as d3zoom, zoomIdentity, select } from "d3";
import { features, points } from "../lib/world.js";
import { places, hdiColor, pct } from "../lib/luck.js";

const props = defineProps({
  selectedId: { type: String, default: null },
  reveal: { type: Boolean, default: false }, // false: mapa neutro (no destripa el resultado)
  interactive: { type: Boolean, default: true }, // false: pulsar no cambia el país
});
const emit = defineEmits(["select"]);

const W = 960, H = 440;
const projection = geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: "FeatureCollection", features });
const path = geoPath(projection);
const graticule = path(geoGraticule10());

// Para centrar y hacer zoom se usa el trozo más grande de cada país
// (así Francia apunta a Europa y no a la Guayana).
function mainPart(f) {
  if (f.geometry.type !== "MultiPolygon") return f;
  let best = null, bestArea = -1;
  for (const coordinates of f.geometry.coordinates) {
    const g = { type: "Polygon", coordinates };
    const a = path.area(g);
    if (a > bestArea) { bestArea = a; best = g; }
  }
  return best;
}

const shapes = features.map((f, i) => ({ i, id: f.id, key: f.key, d: path(f), main: mainPart(f) }));
const dots = points.map((p) => ({ key: p.id, xy: projection(p.coords) }));

function anchor(key) {
  const s = shapes.find((s) => s.key === key && s.id === key) ?? shapes.find((s) => s.key === key);
  if (s) return { c: path.centroid(s.main), b: path.bounds(s.main) };
  const d = dots.find((d) => d.key === key);
  return d ? { c: d.xy, b: [d.xy, d.xy] } : null;
}

const selectedShapes = computed(() => shapes.filter((s) => s.key === props.selectedId));
const blip = computed(() => (props.selectedId ? anchor(props.selectedId)?.c ?? null : null));

function fill(key) {
  const p = places[key];
  if (!p || p.kind === "uninhabited") return "var(--land-empty)";
  if (!props.reveal) return "var(--land)";
  return p.scored ? hdiColor(p.hdi) : "var(--land-nodata)";
}

// ---------- Zoom ----------
const svgEl = ref(null);
const t = shallowRef(zoomIdentity);
let zoomer = null;

onMounted(() => {
  zoomer = d3zoom()
    .scaleExtent([1, 12])
    .translateExtent([[0, 0], [W, H]])
    .on("zoom", (e) => { t.value = e.transform; });
  select(svgEl.value).call(zoomer).on("dblclick.zoom", null);
});

function zoomTo(transform) {
  select(svgEl.value).transition().duration(750).call(zoomer.transform, transform);
}

// Centra el país y acerca lo justo para que se vea bien (más cuanto más pequeño es).
function focus(key) {
  const a = anchor(key);
  if (!a || !zoomer) return;
  const [[x0, y0], [x1, y1]] = a.b;
  const k = Math.max(1, Math.min(8, 0.45 / Math.max((x1 - x0) / W, (y1 - y0) / H, 1 / 18)));
  zoomTo(zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-a.c[0], -a.c[1]));
}
const zoomBy = (f) => select(svgEl.value).transition().duration(300).call(zoomer.scaleBy, f);
const resetZoom = () => zoomTo(zoomIdentity);

defineExpose({ focus });

// ---------- Tooltip ----------
const wrapEl = ref(null);
const tip = ref(null);
function move(event, key) {
  const p = places[key];
  if (!p) return;
  const r = wrapEl.value.getBoundingClientRect();
  let text = "";
  if (props.reveal) {
    text = p.scored ? `más suerte que el ${pct(p.luck)}%${p.kind === "proxy" ? " (aprox.)" : ""}`
      : p.kind === "uninhabited" ? "deshabitado" : "sin datos";
  }
  tip.value = { x: event.clientX - r.left, y: event.clientY - r.top, name: p.name, text, flip: event.clientX - r.left > r.width - 220 };
}
const leave = () => { tip.value = null; };
const pick = (key) => { if (props.interactive && places[key]) emit("select", key); };
</script>

<template>
  <section ref="wrapEl" class="map-wrap" :class="{ locked: !interactive }">
    <svg
      ref="svgEl"
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      aria-label="Mapamundi. Pulsa un país para elegirlo; también puedes buscarlo en la lista."
    >
      <g :transform="t.toString()">
        <path class="graticule" :d="graticule" />
        <path
          v-for="s in shapes"
          :key="s.i"
          v-memo="[fill(s.key)]"
          class="country"
          :style="{ fill: fill(s.key) }"
          :d="s.d"
          @mousemove="move($event, s.key)"
          @mouseleave="leave"
          @click="pick(s.key)"
        />
        <circle
          v-for="d in dots"
          :key="d.key"
          class="country dot"
          :cx="d.xy[0]"
          :cy="d.xy[1]"
          :r="2.5 / t.k"
          :style="{ fill: fill(d.key) }"
          @mousemove="move($event, d.key)"
          @mouseleave="leave"
          @click="pick(d.key)"
        />
        <path v-for="s in selectedShapes" :key="'sel' + s.i" class="selected" :d="s.d" />
        <g v-if="blip" :key="selectedId" class="blip" :transform="`translate(${blip[0]},${blip[1]}) scale(${1 / t.k})`">
          <circle class="ring" r="5" />
          <circle class="ring late" r="5" />
          <circle class="core" r="2.5" />
        </g>
      </g>
    </svg>

    <div v-if="tip" class="tooltip" :class="{ flip: tip.flip }" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
      <b>{{ tip.name }}</b><template v-if="tip.text"> · {{ tip.text }}</template>
    </div>

    <div class="zoom-ctl">
      <button type="button" aria-label="Acercar" @click="zoomBy(1.6)">+</button>
      <button type="button" aria-label="Alejar" @click="zoomBy(1 / 1.6)">−</button>
      <button type="button" aria-label="Ver el mundo entero" @click="resetZoom">⟲</button>
    </div>

    <div v-if="reveal" class="legend">
      <span>Menos suerte</span>
      <div class="bar"></div>
      <span>Más suerte</span>
    </div>
  </section>
</template>
