// Puntos de suerte de cada respuesta. Fuente: docs/PUNTUACIONES.md.
// El resultado es la suma de los puntos del país y de todas las respuestas.
import { QUESTIONS, SECTIONS } from "../questions.js";
import { ETHNIC_GROUPS } from "../data/ethnicities.js";
import { ranked } from "./luck.js";

// ---------- País de nacimiento (sección 1) ----------

// Tramos de IDH → puntos, de mayor a menor.
const HDI_STEPS = [
  [0.94, 25], [0.9, 20], [0.85, 18], [0.78, 15], [0.74, 10], [0.69, 5],
  [0.65, 0], [0.6, -10], [0.5, -15], [0.45, -20],
];
// Lugares fijados a mano (claves de src/data/countries.js).
export const COUNTRY_OVERRIDES = {
  "192": -20, // Cuba (por IDH serían +10)
  "408": -25, // Corea del Norte
  "732": -20, // Sáhara Occidental
  XKX: -10, // Kosovo
  XNC: -15, // Chipre del Norte
};

export const hdiPoints = (hdi) => HDI_STEPS.find(([min]) => hdi >= min)?.[1] ?? -25;

// place: un elemento de `places` (src/lib/luck.js). Los territorios dependientes usan el IDH
// de su país (kind "proxy"); los deshabitados puntúan 0.
export function countryPoints(place) {
  if (!place) return 0;
  if (place.id in COUNTRY_OVERRIDES) return COUNTRY_OVERRIDES[place.id];
  if (place.kind === "uninhabited") return 0;
  return place.hdi != null ? hdiPoints(place.hdi) : 0;
}

// ---------- Raza ----------

// Blanco, Indígena, Asiático y Negro son categorías: puntúa el subgrupo.
export const ETHNICITY_POINTS = {
  blanco: { norte: 35, centro: 10, mediterraneo: 15, este: 5, caucaso: 0 },
  indigena: { roma: -40, norteamerica: -20, latinoamerica: -10, oceania: 0, artico: -20, ainu: -20 },
  asiatico: { sur: -55, este: 25, sudeste: 15, oriente: -45, central: -10 },
  negro: { occidental: -45, oriental: -55, central: -55, austral: -45, tradicional: -75, caribe: -25, america: -20, europa: -15 },
  latino: -10,
  mulato: -45,
  mixto: -35,
  otro: -35,
};

function ethnicityPoints(a) {
  const p = ETHNICITY_POINTS[a?.group];
  if (typeof p === "number") return p;
  return p?.[a.sub] ?? 0;
}

// ---------- Resto de preguntas ----------

const byCount = (step) => ({ 0: 0, 1: step, 2: 2 * step, 3: 3 * step, "3+": 4 * step });
// Puntos que dependen del sexo: { hombre, mujer }.
const bySex = (pts, answers) => pts[answers.sex] ?? 0;

// Para cada pregunta: un mapa respuesta → puntos, o una función (respuesta, answers) → puntos.
export const POINTS = {
  // Tú y tu origen
  birthplace: () => 0, // se cuenta aparte, como «País»
  sex: { hombre: 0, mujer: 5 },
  ethnicity: (a) => ethnicityPoints(a),
  sameAsCountry: { true: 25, false: -25 },
  parentsSame: { true: 10, false: -10 },
  language: { ingles: 25, chino: 20, hindi: 15, espanol: 10, arabe: 5, frances: 0, bengali: -5, portugues: -10, indonesio: -15, urdu: -20, otra: -25 },
  religion: {
    catolica: 25, ortodoxa: 20, protestante: 15, "cristiana-independiente": 10, suni: -45,
    visnuismo: -35, shivismo: -35, shaktismo: -40, "budismo-mahayana": -30, ateo: -50, otra: -75,
  },
  culturalMinority: { hegemonica: 15, minoria: 0, estigmatizada: -15 },

  // Familia e infancia
  childhoodArea: { urbana: 10, suburbana: 5, rural: -10 },
  parentsEducation: { ninguno: -8, primaria: -5, secundaria: 0, fp: 2, universidad: 6, posgrado: 8 },
  familyEconomy: { "muy-dificil": -40, justa: -20, media: 0, acomodada: 75, alta: 100 },
  educationAccess: { ambas: 55, privada: 35, universidad: 35, ninguna: -50 },
  basicNeeds: { nunca: 35, "alguna-vez": -30, temporadas: -80, ahora: -120 },
  supportNetwork: { solida: 80, limitada: 0, no: -80 },

  // Economía y finanzas
  childhoodHome: { propiedad: 35, "alquiler-estable": 0, "alquiler-inestable": -60, otra: -150 },
  realEstate: { ambas: 100, poseo: 60, heredare: 60, no: -30 },
  emergencyExpense: { si: 5, costaria: 0, no: -60 },
  jobLossSafetyNet: { indefinidamente: 80, temporal: 30, no: -25 },
  financialEducation: { inversiones: 10, ahorro: 20, nada: -10, estres: -25 },
  unpaidInternships: { si: 15, trabajando: 0, no: -15, na: 0 },

  // Social y redes de apoyo
  contacts: { varios: 35, alguno: 10, no: -15 },
  familyStructure: { biparental: 35, ausentes: 0, monoparental: -30, desestructurada: -40, otros: -50 },
  neighborhood: { seguro: 5, normal: 0, problemas: -5, marginal: -25 },
  violence: { nunca: 15, "alguna-vez": -15, "a-menudo": -25, habitual: -30 },
  socialJudgment: { nunca: 15, "rara-vez": 5, "a-veces": -5, "a-menudo": -15, siempre: -20 },

  // Cultural y educativo
  books: { muchos: 5, algunos: 1, pocos: -4 },
  extracurricular: { varias: 6, alguna: 2, ninguna: -3 },
  accent: { estandar: 3, "acento-sin": 0, discriminacion: -5 },
  roleModels: { varios: 5, alguno: 2, no: -3 },
  technology: { pronto: 4, tarde: 1, compartido: 0, no: -4 },

  // Salud, bienestar y biología
  chronicCondition: { no: 45, leve: 0, limita: -80, coste: -250 },
  mentalHealth: { privada: 20, publica: 10, inaccesible: -10, "no-necesario": 3 },
  nutrition: { siempre: 4, casi: 1, "no-siempre": -4, no: -8 },
  appearance: { si: 4, "mas-o-menos": 0, no: -4 },

  // Pareja, sexualidad e hijos
  orientation: (v) => (v === "heterosexual" ? 25 : v === "gay" || v === "lesbiana" ? -25 : -55),
  // Ser virgen cuenta además como el tramo «de 0 a 10» parejas (esa pregunta no aparece).
  virgin: (v, a) => (v === "si" ? bySex({ hombre: -35, mujer: 100 }, a) + PARTNERS["0-10"](a) : 0),
  sexualPartners: (v, a) => PARTNERS[v]?.(a) ?? 0,
  maritalStatus: { casado: 35, pareja: 15, prometido: 20, soltero: 0, divorciado: -20, viudo: -30 },
  children: byCount(10),
  childrenOutsideMarriage: byCount(-20),
  childrenFromPartnerEx: byCount(-30),

  // Situación legal
  legalStatus: { nacionalidad: 5, residencia: 0, tramite: -5, irregular: -35 },
  nationalityPath: { nacimiento: 30, facil: 10, dificil: -10, barreras: -25, "sin-regularizar": -100 },
  prison: { no: 0, "menos-1": -35, "mas-1": -55 },
};

const PARTNERS = {
  "0-10": (a) => bySex({ hombre: 5, mujer: 75 }, a),
  "10-100": (a) => bySex({ hombre: 7, mujer: -45 }, a),
  "100+": (a) => bySex({ hombre: 7, mujer: -95 }, a),
};

export function questionPoints(id, value, answers) {
  const rule = POINTS[id];
  if (value == null || rule == null) return 0;
  return typeof rule === "function" ? rule(value, answers) : rule[String(value)] ?? 0;
}

// Puntos totales y desglose. `questions`: las preguntas que tocan (las que se han mostrado).
export function scoreAnswers(answers, place, questions = QUESTIONS) {
  const country = countryPoints(place);
  const sections = SECTIONS.map((s) => ({
    id: s.id,
    title: s.title,
    points: questions.filter((q) => q.section === s.id).reduce((t, q) => t + questionPoints(q.id, answers[q.id], answers), 0),
  }));
  return { country, sections, total: country + sections.reduce((t, s) => t + s.points, 0) };
}

// ---------- Opciones de cada pregunta (para el desglose y las comprobaciones) ----------

// Todas las respuestas posibles de una pregunta: [{ value, label }].
export function optionsOf(q) {
  if (q.type === "yesno") return [{ value: true, label: "Sí" }, { value: false, label: "No" }];
  if (q.type === "ethnicity") {
    return ETHNIC_GROUPS.flatMap((g) => (g.subgroups.length
      ? g.subgroups.map((s) => ({ value: { group: g.id, sub: s.id }, label: `${g.name} · ${s.name}` }))
      : [{ value: { group: g.id }, label: g.name }]));
  }
  return (q.options ?? []).map((o) => ({ value: o.v, label: o.t }));
}

const sameAnswer = (a, b) => (a && typeof a === "object" ? a.group === b?.group && (a.sub ?? null) === (b?.sub ?? null) : a === b);

// Desglose de una pregunta: cada opción con sus puntos (según tu sexo) y cuál elegiste.
export function breakdown(q, answers) {
  return optionsOf(q).map((o) => ({
    label: o.label,
    points: questionPoints(q.id, o.value, answers),
    chosen: sameAnswer(o.value, answers[q.id]),
  }));
}

// ---------- Percentil: comparación con personas simuladas ----------
// No hay datos reales de cómo se reparten estos puntos en el mundo. Se simulan personas:
// país al azar según su población y el resto de respuestas al azar entre las opciones.
export const SIMULATED = 20000;

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let simulated = null;
function simulatedTotals() {
  if (simulated) return simulated;
  const rand = mulberry32(20241116); // semilla fija: el mismo resultado siempre
  const totalPop = ranked.reduce((t, d) => t + d.pop, 0);
  const opts = Object.fromEntries(QUESTIONS.map((q) => [q.id, optionsOf(q)]));
  const totals = new Float64Array(SIMULATED);
  for (let i = 0; i < SIMULATED; i++) {
    let r = rand() * totalPop;
    const place = ranked.find((d) => (r -= d.pop) < 0) ?? ranked[ranked.length - 1];
    const answers = { birthplace: place.id };
    const shown = [];
    for (const q of QUESTIONS) {
      if (q.id === "birthplace" || (q.showIf && !q.showIf(answers))) continue;
      const o = opts[q.id];
      answers[q.id] = o[Math.floor(rand() * o.length)].value;
      shown.push(q);
    }
    totals[i] = scoreAnswers(answers, { ...place, kind: "hdi" }, shown).total;
  }
  simulated = totals.sort();
  return simulated;
}

// Porcentaje de personas simuladas con más puntos que tú (los empates cuentan la mitad).
// 0,9 → «perteneces al 0,9 % más afortunado».
export function topPercent(total) {
  const s = simulatedTotals();
  let above = 0, equal = 0;
  for (const v of s) { if (v > total) above++; else if (v === total) equal++; }
  return ((above + equal / 2) / s.length) * 100;
}

// Veredicto según el percentil.
export function verdict(top) {
  if (top <= 1) return { title: "Deidad entre los mortales", text: "Eres una deidad entre los mortales. Caminas entre la escoria que son los demás seres mortales." };
  if (top <= 10) return { title: "Afortunado", text: "Siéntete afortunado: tienes aquello con lo que el 90 % del planeta sueña." };
  if (top <= 30) return { title: "Buena mano", text: "No eres de la élite, pero te tocaron buenas cartas: la mayoría del mundo firmaría ahora mismo por tener tu vida." };
  if (top <= 40) return { title: "Más suerte que la mayoría", text: "La lotería te sonrió, aunque sin pasarse: vives mejor que casi todo el planeta, sin lujos que presumir." };
  if (top <= 50) return { title: "En la media", text: "Justo por encima de la mitad: la vida no te regaló nada, pero tampoco te lo quitó todo." };
  return { title: "La lotería te dio la espalda", text: "Te tocó la peor parte del reparto: más de la mitad del planeta salió con mejores cartas que tú. La partida venía amañada desde antes de nacer, y nada de eso es culpa tuya." };
}
