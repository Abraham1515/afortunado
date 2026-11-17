<script setup>
import { computed } from "vue";
import { ranked, worldLE, bestLE, worstLE, tierOf, luckColor, pct, pctSmall, popText } from "../lib/luck.js";

const props = defineProps({
  place: { type: Object, required: true },
  fromLottery: { type: Boolean, default: false },
});

const p = computed(() => props.place);
const color = computed(() => (p.value.scored ? luckColor(p.value.luck) : "var(--muted)"));
const approx = computed(() => (p.value.kind === "proxy" ? "≈ " : ""));

// Comparación de esperanza de vida con la media mundial y con los extremos.
const le = computed(() => {
  const v = p.value.le;
  if (v == null) return null;
  const diff = v - worldLE;
  return {
    same: Math.abs(diff) < 0.5,
    diff: Math.abs(diff).toFixed(1),
    more: diff > 0,
    toBest: p.value.id === bestLE.id ? null : (bestLE.le - v).toFixed(1),
    toWorst: (v - worstLE.le).toFixed(1),
  };
});
</script>

<template>
  <div class="result" aria-live="polite">
    <p class="born">{{ fromLottery ? "🎲 Esta vez has nacido en" : "Naciste en" }}</p>
    <h2 class="country-name">{{ p.name }}</h2>

    <!-- Con porcentaje: país con IDH, o territorio con IDH aproximado -->
    <template v-if="p.scored">
      <div class="big" :style="{ color }">{{ approx }}{{ pct(p.luck) }}%</div>
      <p class="big-label">Eres más afortunado que el <b>{{ approx }}{{ pct(p.luck) }}%</b> de la humanidad.</p>
      <span class="tier" :style="{ background: color }">{{ tierOf(p.luck) }}</span>
      <div class="meter" role="meter" :aria-valuenow="p.luck.toFixed(1)" aria-valuemin="0" aria-valuemax="100" aria-label="Porcentaje de la humanidad con menos suerte">
        <div :style="{ width: p.luck + '%', background: color }"></div>
      </div>
      <div class="stats">
        <div class="stat"><b>{{ approx }}{{ p.hdi.toFixed(3) }}</b><span>Índice de Desarrollo Humano</span></div>
        <div class="stat"><b>{{ approx }}#{{ p.rank }}</b><span>de {{ ranked.length }} países</span></div>
        <div class="stat"><b>{{ p.le != null ? p.le.toFixed(1) : "—" }}</b><span>años de esperanza de vida</span></div>
        <div class="stat"><b>{{ pctSmall(p.share) }}%</b><span>de la población mundial</span></div>
      </div>
      <p v-if="p.kind === 'proxy'" class="note">
        {{ p.name }} no tiene IDH propio en el informe del PNUD: se usa el de <b>{{ p.proxyName }}</b> como aproximación.
      </p>
    </template>

    <!-- Sin porcentaje -->
    <template v-else-if="p.kind === 'nodata'">
      <div class="big muted">¿?</div>
      <p class="big-label">No hay datos fiables para calcular tu suerte.</p>
      <p class="note">{{ p.note }}</p>
    </template>
    <template v-else>
      <div class="big muted">∅</div>
      <p class="big-label">Aquí no nace casi nadie.</p>
      <p class="note">{{ p.note }}</p>
    </template>

    <ul v-if="p.kind !== 'uninhabited'" class="facts">
      <li v-if="le && le.same">Tu esperanza de vida ({{ p.le.toFixed(1) }} años) está en la media mundial.</li>
      <li v-else-if="le">
        Vivirías de media <b>{{ le.diff }} años {{ le.more ? "más" : "menos" }}</b> que la media mundial ({{ worldLE.toFixed(1) }}).
      </li>
      <li v-if="le && le.toBest">En {{ bestLE.name }} vivirías {{ le.toBest }} años más; en {{ worstLE.name }}, {{ le.toWorst }} años menos.</li>
      <li v-else-if="le">Es el lugar con mayor esperanza de vida del mundo.</li>
      <li v-if="p.pop > 0">Aquí vive el <b>{{ pctSmall(p.share) }}%</b> de la humanidad ({{ popText(p.pop) }}).</li>
      <li v-if="p.scored">Un <b>{{ pct(p.unluck) }}%</b> de la gente nació en un país con más desarrollo que el tuyo.</li>
    </ul>
    <p v-if="p.scored && p.kind !== 'proxy' && p.note" class="note">{{ p.note }}</p>
  </div>
</template>
