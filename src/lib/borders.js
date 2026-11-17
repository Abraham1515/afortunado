// Ajustes de fronteras sobre el mapa de world-atlas (Natural Earth 1:110m).
// Natural Earth dibuja las fronteras "de facto"; aquí usamos las reconocidas internacionalmente:
//   1. Crimea forma parte de Ucrania (no de Rusia).
//   2. El Sáhara Occidental es un territorio propio y completo: la frontera con Marruecos
//      es el paralelo 27°40' N, no el muro marroquí (el "berm").
// Modifica la topología que recibe. Si los datos no tienen la forma esperada,
// no toca ese ajuste y avisa en la consola.
import { geoContains } from "d3";
import { feature, mergeArcs } from "topojson-client";

export function fixBorders(topo) {
  const geoms = topo.objects.countries.geometries;
  const byId = (id) => geoms.find((g) => g.id === id);
  const flip = (i) => ~i; // arco recorrido al revés (convención TopoJSON)

  // Los arcos van cuantizados y codificados en deltas: se pasan a absolutos y vuelta.
  const decode = (arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => [x += dx, y += dy]); };
  const encode = (pts) => pts.map(([x, y], i) => (i ? [x - pts[i - 1][0], y - pts[i - 1][1]] : [x, y]));
  const addArc = (pts) => topo.arcs.push(encode(pts)) - 1;
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const quant = ([lon, lat]) => [Math.round((lon - tx) / sx), Math.round((lat - ty) / sy)];
  const lonOf = ([x]) => x * sx + tx;
  const latOf = ([, y]) => y * sy + ty;
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const start = (i) => { const p = decode(topo.arcs[i < 0 ? ~i : i]); return i < 0 ? p[p.length - 1] : p[0]; };
  const end = (i) => { const p = decode(topo.arcs[i < 0 ? ~i : i]); return i < 0 ? p[0] : p[p.length - 1]; };

  // ---------- 1. Crimea → Ucrania ----------
  function crimeaToUkraine() {
    const russia = byId("643"), ukraine = byId("804");
    if (!russia || !ukraine || russia.type !== "MultiPolygon") throw new Error("geometrías inesperadas");

    // Polígono de Rusia que contiene Simferópol: Crimea.
    const SIMFEROPOL = [34.1, 44.95];
    const idx = russia.arcs.findIndex((poly) =>
      geoContains(feature(topo, { type: "Polygon", arcs: poly }), SIMFEROPOL));
    if (idx < 0) throw new Error("no encuentro Crimea");
    const crimea = { type: "Polygon", arcs: russia.arcs[idx] };

    // Debe tocar Ucrania (istmo de Perekop); si no, fusionar dejaría un polígono suelto, que también vale,
    // pero indicaría que el mapa no es el esperado.
    const ukArcs = new Set(JSON.stringify(ukraine.arcs).match(/-?\d+/g).map(Number));
    if (!crimea.arcs.flat().some((a) => ukArcs.has(flip(a)))) throw new Error("Crimea no comparte frontera con Ucrania en el mapa");

    // Fusiona Ucrania y Crimea: desaparecen las fronteras internas que compartían.
    const merged = mergeArcs(topo, [ukraine, crimea]);
    ukraine.type = merged.type;
    ukraine.arcs = merged.arcs;
    russia.arcs.splice(idx, 1);
  }

  // ---------- 2. Sáhara Occidental completo ----------
  function westernSaharaWhole() {
    const morocco = byId("504"), ws = byId("732");
    if (!morocco || !ws || morocco.type !== "Polygon" || ws.type !== "Polygon") throw new Error("geometrías inesperadas");

    const BORDER_LAT = 27 + 40 / 60; // 27°40' N
    const moRing = morocco.arcs[0];

    // Arco del muro: lo comparten Marruecos y el Sáhara.
    const berm = ws.arcs[0].find((a) => moRing.includes(flip(a)));
    if (berm === undefined) throw new Error("no encuentro la frontera compartida");
    const moBermPos = moRing.indexOf(flip(berm));

    // La costa atlántica de Marruecos es el arco que sigue al muro: empieza en el cabo Blanco.
    const coastRef = moRing[(moBermPos + 1) % moRing.length];
    const coast = decode(topo.arcs[coastRef < 0 ? ~coastRef : coastRef]);
    if (coastRef < 0) coast.reverse();
    if (!same(coast[0], end(flip(berm)))) throw new Error("la costa no empieza donde acaba el muro");

    // Punto de la costa donde se cruza el paralelo 27°40'.
    const j = coast.findIndex((p) => latOf(p) >= BORDER_LAT);
    if (j < 1) throw new Error("la costa no cruza el paralelo 27°40'");
    const [a, b] = [coast[j - 1], coast[j]];
    const t = (BORDER_LAT - latOf(a)) / (latOf(b) - latOf(a));
    const cross = quant([lonOf(a) + t * (lonOf(b) - lonOf(a)), BORDER_LAT]);

    // Extremo oriental: donde el muro llega a la frontera con Argelia (≈ 8°40' O, 27°40' N).
    const east = start(flip(berm));

    const coastSouth = addArc(coast.slice(0, j).concat([cross])); // cabo Blanco → 27°40'
    const coastNorth = addArc([cross].concat(coast.slice(j)));    // 27°40' → Mediterráneo
    const border = addArc([cross, [east[0], cross[1]], east].filter((p, i, arr) => !i || !same(p, arr[i - 1])));

    // Marruecos: …Argelia → frontera 27°40' (de este a oeste) → costa norte…
    morocco.arcs[0] = moRing.slice(0, moBermPos)
      .concat([flip(border), coastNorth], moRing.slice(moBermPos + 2));
    // Sáhara: su anillo, cambiando el muro por la costa sur y la frontera 27°40' (de oeste a este).
    const wsRing = ws.arcs[0], p = wsRing.indexOf(berm);
    ws.arcs[0] = wsRing.slice(0, p).concat([coastSouth, border], wsRing.slice(p + 1));
  }

  for (const [name, fix] of [["Crimea", crimeaToUkraine], ["Sáhara Occidental", westernSaharaWhole]]) {
    try { fix(); } catch (e) { console.warn(`fixBorders: no se aplicó el ajuste de ${name}:`, e.message); }
  }
  return topo;
}
