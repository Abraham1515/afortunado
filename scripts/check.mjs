// Comprobaciones de datos y fronteras: npm run check
// Falla (código de salida 1) si algo no cuadra.
import { createRequire } from "node:module";
import { geoContains, geoArea } from "d3";
import { feature } from "topojson-client";
import { fixBorders } from "../src/lib/borders.js";
import { places, placeList } from "../src/lib/luck.js";
import { UNCODED } from "../src/data/countries.js";
import { QUESTIONS, SECTIONS } from "../src/questions.js";
import { ETHNIC_GROUPS } from "../src/data/ethnicities.js";
import { POINTS, ETHNICITY_POINTS, countryPoints, questionPoints, optionsOf } from "../src/lib/score.js";

const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-50m.json");

let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? "✔" : "✘"} ${msg}`); if (!ok) failures++; };

// Fronteras
const warns = [];
const warn = console.warn; console.warn = (...a) => warns.push(a.join(" "));
const topo = fixBorders(structuredClone(world));
console.warn = warn;
check(warns.length === 0, `ajustes de fronteras aplicados${warns.length ? ": " + warns.join("; ") : ""}`);

const features = feature(topo, topo.objects.countries).features
  .map((f) => Object.assign(f, { key: UNCODED[f.properties.name] ?? f.id ?? null }));
const countryAt = (p) => features.filter((f) => geoContains(f, p)).map((f) => f.key);

const expect = {
  "804": { Simferópol: [34.1, 44.95], Sebastopol: [33.52, 44.6], Kerch: [36.47, 45.36], Kiev: [30.52, 50.45] },
  "643": { Moscú: [37.6, 55.75], Rostov: [39.7, 47.23] },
  "732": { "El Aaiún": [-13.2, 27.15], Auserd: [-14.32, 22.55], Smara: [-11.66, 26.74] },
  "504": { Rabat: [-6.84, 34.0], Agadir: [-9.6, 30.42], "Tan-Tan": [-11.1, 28.44] },
};
for (const [id, cities] of Object.entries(expect)) {
  for (const [city, p] of Object.entries(cities)) {
    const got = countryAt(p);
    check(got.length === 1 && got[0] === id, `${city} está en ${places[id].name}${got[0] !== id ? ` (sale en ${got.map((k) => places[k]?.name ?? k).join(", ") || "ninguno"})` : ""}`);
  }
}
const area = (id) => geoArea(features.find((f) => f.key === id)) * 6371 ** 2 / 1e3;
console.log(`  áreas (mil km²): Ucrania ${area("804").toFixed(0)}, Marruecos ${area("504").toFixed(0)}, Sáhara Occidental ${area("732").toFixed(0)}`);

// Cobertura: cada forma del mapa tiene un lugar elegible
const orphan = features.filter((f) => !places[f.key]).map((f) => `${f.id ?? "sin id"} ${f.properties.name}`);
check(orphan.length === 0, `todas las formas del mapa se pueden elegir${orphan.length ? ": faltan " + orphan.join(", ") : ""}`);

// Datos coherentes
for (const p of placeList) {
  if (p.scored && !(p.hdi > 0.3 && p.hdi < 1 && p.luck >= 0 && p.luck <= 100)) check(false, `${p.name}: IDH o suerte fuera de rango`);
  if (p.le != null && !(p.le > 45 && p.le < 90)) check(false, `${p.name}: esperanza de vida fuera de rango`);
}
const kinds = {};
for (const p of placeList) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
const onMap = new Set(features.map((f) => f.key));
console.log(`  ${placeList.length} lugares elegibles:`, kinds);
console.log(`  solo en el buscador (no salen en el mapa): ${placeList.filter((p) => !onMap.has(p.id)).map((p) => p.name).join(", ")}`);

// Puntos: cada opción de cada pregunta tiene puntos (docs/PUNTUACIONES.md)
const missing = [];
for (const q of QUESTIONS) {
  if (!(q.id in POINTS)) missing.push(q.id);
  for (const o of q.options ?? []) {
    if (typeof POINTS[q.id] === "object" && !(o.v in POINTS[q.id])) missing.push(`${q.id}=${o.v}`);
  }
}
for (const g of ETHNIC_GROUPS) {
  const p = ETHNICITY_POINTS[g.id];
  if (p == null) missing.push(`raza=${g.id}`);
  for (const s of g.subgroups) if (typeof p !== "object" || !(s.id in p)) missing.push(`raza=${g.id}/${s.id}`);
}
check(missing.length === 0, `todas las respuestas tienen puntos${missing.length ? ": faltan " + missing.join(", ") : ""}`);

// Rango posible de puntos por bloque (mínimo y máximo de cada pregunta, con los dos sexos).
const range = (q) => {
  const pts = ["hombre", "mujer"].flatMap((sex) => optionsOf(q).map((o) => questionPoints(q.id, o.value, { sex })));
  if (q.showIf) pts.push(0); // puede no aparecer
  return [Math.min(...pts), Math.max(...pts)];
};
const cp = Object.values(places).map(countryPoints);
const rows = [["País", Math.min(...cp), Math.max(...cp)]];
for (const s of SECTIONS) {
  const rs = QUESTIONS.filter((q) => q.section === s.id && q.id !== "birthplace").map(range);
  rows.push([s.title, rs.reduce((t, r) => t + r[0], 0), rs.reduce((t, r) => t + r[1], 0)]);
}
rows.push(["Total", rows.reduce((t, r) => t + r[1], 0), rows.reduce((t, r) => t + r[2], 0)]);
console.log("  rango de puntos (mín / máx):");
for (const [n, lo, hi] of rows) console.log(`    ${n.padEnd(28)} ${String(lo).padStart(6)} ${String(hi).padStart(6)}`);

process.exit(failures ? 1 : 0);
