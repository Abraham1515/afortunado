// Cálculo de la "suerte" de nacer en cada país o territorio.
import { sum, greatest, least, extent, format, scaleSequential, interpolateLab } from "d3";
import { COUNTRIES, TERRITORIES, NOTES } from "../data/countries.js";

// Base del ranking: solo los países con IDH propio del PNUD.
export const ranked = Object.entries(COUNTRIES)
  .map(([id, c]) => ({ id, name: c[0], hdi: c[1], le: c[2], pop: c[3] }))
  .sort((a, b) => a.hdi - b.hdi);

export const totalPop = sum(ranked, (d) => d.pop);
export const worldLE = sum(ranked, (d) => d.le * d.pop) / totalPop;
export const bestLE = greatest(ranked, (d) => d.le);
export const worstLE = least(ranked, (d) => d.le);

// "Más afortunado que X%" = porcentaje de la humanidad que vive en un país con IDH menor.
// "Menos afortunado que Y%" = porcentaje que vive en un país con IDH mayor.
function scoreFor(hdi) {
  return {
    luck: (sum(ranked, (o) => (o.hdi < hdi ? o.pop : 0)) / totalPop) * 100,
    unluck: (sum(ranked, (o) => (o.hdi > hdi ? o.pop : 0)) / totalPop) * 100,
    rank: ranked.filter((o) => o.hdi > hdi).length + 1,
  };
}

// Todos los lugares que se pueden elegir, indexados por clave.
//   kind: "hdi" | "proxy" | "nodata" | "uninhabited"
//   scored: true si tiene porcentaje de suerte (hdi o proxy)
export const places = {};
for (const d of ranked) {
  places[d.id] = { ...d, kind: "hdi", scored: true, note: NOTES[d.id] ?? null, ...scoreFor(d.hdi) };
}
for (const [id, t] of Object.entries(TERRITORIES)) {
  const p = { id, name: t.name, kind: t.kind, le: t.le ?? null, pop: t.pop ?? 0, note: t.note ?? NOTES[id] ?? null };
  if (t.kind === "proxy") {
    const ref = places[t.proxy];
    Object.assign(p, { hdi: ref.hdi, proxyName: ref.name, scored: true, ...scoreFor(ref.hdi) });
  } else {
    p.scored = false;
  }
  places[id] = p;
}
for (const p of Object.values(places)) p.share = (p.pop / totalPop) * 100;

// Lista para el buscador, en orden alfabético.
export const placeList = Object.values(places).sort((a, b) => a.name.localeCompare(b.name, "es"));

// Búsqueda sin tildes ni mayúsculas: "japon" encuentra "Japón".
export const fold = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

// Bebé al azar: probabilidad proporcional a la población.
export function randomBirth() {
  let r = Math.random() * totalPop;
  return ranked.find((d) => (r -= d.pop) < 0) ?? ranked[ranked.length - 1];
}

export function tierOf(luck) {
  if (luck >= 90) return "Te tocó el premio gordo";
  if (luck >= 70) return "Muy afortunado";
  if (luck >= 50) return "Más suerte que la media";
  if (luck >= 30) return "Por debajo de la media";
  if (luck >= 10) return "Poca suerte";
  return "La lotería no te sonrió";
}

// Colores de fósforo de radar: verde apagado (menos suerte) → verde brillante (más suerte).
export const RAMP = ["#0b3a1e", "#39ff88"];
export const hdiColor = scaleSequential(interpolateLab(...RAMP)).domain(extent(ranked, (d) => d.hdi));
export const luckColor = scaleSequential(interpolateLab("#2a8a52", "#7dffb2")).domain([0, 100]);

export const pct = format(".1f");
export const pctSmall = (v) => (v > 0 && v < 0.1 ? v.toFixed(2) : pct(v));
export function popText(m) {
  if (m >= 1000) return `${format(".2f")(m / 1000)} mil millones de personas`;
  if (m >= 1) return `${format(",.1f")(m).replace(/,/g, ".")} millones de personas`;
  const n = Math.round(m * 1e6);
  return `${n.toLocaleString("es-ES")} personas`;
}
