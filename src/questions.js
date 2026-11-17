// Preguntas del cuestionario, agrupadas en secciones y en orden.
//
// Cada pregunta tiene:
//   id        clave de la respuesta en `answers`
//   section   id de la sección (SECTIONS)
//   type      qué componente la muestra: country | ethnicity | yesno | choice
//   short     etiqueta corta para el resumen del resultado
//   title     la pregunta
//   hint      texto de ayuda (opcional)
//   answered  (respuesta) => true si se puede pasar a la siguiente
//   summary   (respuesta) => texto para el resumen
//   showIf    (answers) => true si la pregunta debe aparecer (opcional; por defecto, siempre)
// Para añadir una pregunta basta con añadir un objeto aquí (si su tipo ya existe).
// Los puntos de cada respuesta están en src/lib/score.js (ver docs/PUNTUACIONES.md).
import { places, placeList } from "./lib/luck.js";
import { isEthnicityAnswered, describeEthnicity } from "./data/ethnicities.js";

export const SECTIONS = [
  { id: "origen", title: "Tú y tu origen" },
  { id: "familia", title: "Familia e infancia" },
  { id: "economia", title: "Economía y finanzas", desc: "La estabilidad material, la seguridad financiera y el acceso a capital inicial." },
  { id: "social", title: "Social y redes de apoyo", desc: "La influencia, los contactos y el apoyo de la comunidad con los que cuentas." },
  { id: "cultural", title: "Cultural y educativo", desc: "El acceso al conocimiento, los referentes y el capital simbólico." },
  { id: "salud", title: "Salud, bienestar y biología", desc: "La suerte genética, el acceso a la sanidad y la salud mental." },
  { id: "pareja", title: "Pareja, sexualidad e hijos" },
  { id: "legal", title: "Situación legal" },
];
export const sectionById = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

const yesno = {
  type: "yesno",
  answered: (v) => v === true || v === false,
  summary: (v) => (v ? "Sí" : "No"),
};

// Pregunta de opciones cerradas: [{ v: valor, t: texto, d: descripción opcional }]
const choice = (options) => ({
  type: "choice",
  options,
  answered: (v) => options.some((o) => o.v === v),
  summary: (v) => options.find((o) => o.v === v)?.t ?? "",
});
const NO_ANSWER = { v: "nodecir", t: "Prefiero no decirlo" };

const LANGUAGES = [
  { v: "ingles", t: "Inglés" },
  { v: "chino", t: "Chino", d: "Mandarín, cantonés u otra variedad" },
  { v: "hindi", t: "Hindi" },
  { v: "espanol", t: "Español" },
  { v: "arabe", t: "Árabe" },
  { v: "frances", t: "Francés" },
  { v: "bengali", t: "Bengalí" },
  { v: "portugues", t: "Portugués" },
  { v: "indonesio", t: "Indonesio" },
  { v: "urdu", t: "Urdu" },
  { v: "otra", t: "Otra lengua" },
];

const RELIGIONS = [
  { v: "catolica", t: "Catolicismo" },
  { v: "ortodoxa", t: "Cristianismo ortodoxo" },
  { v: "protestante", t: "Protestantismo" },
  { v: "cristiana-independiente", t: "Cristianos independientes", d: "Iglesias no ligadas a las grandes confesiones" },
  { v: "suni", t: "Islam suní" },
  { v: "visnuismo", t: "Visnuismo", d: "Hinduismo devoto de Visnú" },
  { v: "shivismo", t: "Shivismo", d: "Hinduismo devoto de Shiva" },
  { v: "shaktismo", t: "Shaktismo", d: "Hinduismo devoto de la Diosa (Shakti)" },
  { v: "budismo-mahayana", t: "Budismo mahayana" },
  { v: "ateo", t: "Ateo" },
  { v: "otra", t: "Otra religión" },
];

// Opciones de número de hijos (0, 1, 2, 3, más de 3).
const COUNT = [
  { v: "0", t: "Ninguno" },
  { v: "1", t: "1" },
  { v: "2", t: "2" },
  { v: "3", t: "3" },
  { v: "3+", t: "Más de 3" },
];

export const QUESTIONS = [
  // ---------- Tú y tu origen ----------
  {
    id: "birthplace",
    section: "origen",
    type: "country",
    short: "País de nacimiento",
    title: "¿En qué país has nacido?",
    hint: `Búscalo en la lista o púlsalo en el mapa. Están los ${placeList.length}: también territorios como Groenlandia, el Sáhara Occidental o las islas más pequeñas.`,
    answered: (v) => !!v,
    summary: (v) => places[v]?.name ?? "",
  },
  {
    id: "sex",
    section: "origen",
    ...choice([{ v: "hombre", t: "Hombre" }, { v: "mujer", t: "Mujer" }]),
    short: "Sexo de nacimiento",
    title: "¿Cuál es tu sexo de nacimiento?",
  },
  {
    id: "ethnicity",
    section: "origen",
    type: "ethnicity",
    short: "Origen",
    title: "¿De qué raza eres?",
    hint: "Elige el grupo con el que te identificas y, si tiene subgrupos, uno de ellos.",
    answered: isEthnicityAnswered,
    summary: describeEthnicity,
  },
  {
    id: "sameAsCountry",
    section: "origen",
    ...yesno,
    short: "Mismo origen que tu país",
    title: "¿Tienes el mismo origen étnico que el país al que perteneces?",
    hint: "Es decir, si tu origen es el mayoritario del país en el que naciste.",
  },
  {
    id: "parentsSame",
    section: "origen",
    ...yesno,
    short: "Padres del mismo origen",
    title: "¿Tienen tus padres el mismo origen étnico entre ellos?",
    hint: "Si no lo tienen, eres mestizo.",
  },
  {
    id: "language",
    section: "origen",
    ...choice(LANGUAGES),
    short: "Lengua materna",
    title: "¿Cuál es la lengua materna que se hablaba en tu hogar durante tu infancia?",
    hint: "Si se hablaba más de una, elige la principal.",
  },
  {
    id: "religion",
    section: "origen",
    ...choice(RELIGIONS),
    short: "Religión",
    title: "¿Cuál es tu religión?",
  },
  {
    id: "culturalMinority",
    section: "origen",
    ...choice([
      { v: "hegemonica", t: "Coincide con la mayoritaria" },
      { v: "minoria", t: "Pertenezco a una minoría, pero no sufre estigmatización" },
      { v: "estigmatizada", t: "Pertenezco a una minoría que sufre estigmatización" },
    ]),
    short: "Cultura o religión minoritaria",
    title: "¿Tu cultura o religión de origen coincide con la hegemónica del lugar donde vives, o perteneces a una minoría que sufre estigmatización?",
  },

  // ---------- Familia e infancia ----------
  {
    id: "childhoodArea",
    section: "familia",
    ...choice([
      { v: "urbana", t: "Urbana", d: "Una ciudad" },
      { v: "suburbana", t: "Suburbana", d: "Las afueras o el área metropolitana de una ciudad" },
      { v: "rural", t: "Rural", d: "Un pueblo o el campo" },
    ]),
    short: "Zona de tu infancia",
    title: "¿En qué tipo de zona viviste durante la mayor parte de tu infancia?",
  },
  {
    id: "parentsEducation",
    section: "familia",
    ...choice([
      { v: "ninguno", t: "Sin estudios" },
      { v: "primaria", t: "Primaria" },
      { v: "secundaria", t: "Secundaria", d: "ESO, bachillerato o equivalente" },
      { v: "fp", t: "Formación profesional" },
      { v: "universidad", t: "Universidad", d: "Grado o licenciatura" },
      { v: "posgrado", t: "Posgrado", d: "Máster o doctorado" },
    ]),
    short: "Estudios de tus padres",
    title: "¿Cuál era el nivel educativo máximo alcanzado por tus padres?",
    hint: "El más alto de los dos.",
  },
  {
    id: "familyEconomy",
    section: "familia",
    ...choice([
      { v: "muy-dificil", t: "Muy difícil", d: "No llegábamos a fin de mes" },
      { v: "justa", t: "Justa", d: "Llegábamos, pero sin margen" },
      { v: "media", t: "Media", d: "Vivíamos con cierta tranquilidad" },
      { v: "acomodada", t: "Acomodada", d: "Nos sobraba para ahorrar y darnos caprichos" },
      { v: "alta", t: "Alta", d: "Mucho más dinero que la mayoría" },
    ]),
    short: "Economía familiar en tu adolescencia",
    title: "¿Cuál era la situación económica aproximada de tu familia durante tu adolescencia?",
  },
  {
    id: "educationAccess",
    section: "familia",
    ...choice([
      { v: "ambas", t: "Sí, las dos cosas", d: "Educación privada y universidad sin trabajar a tiempo completo" },
      { v: "privada", t: "Solo educación privada" },
      { v: "universidad", t: "Solo universidad sin trabajar a tiempo completo" },
      { v: "ninguna", t: "Ninguna de las dos" },
    ]),
    short: "Educación privada / universidad sin trabajar",
    title: "¿Tuviste acceso a educación privada o pudiste asistir a la universidad sin necesidad de trabajar a tiempo completo?",
  },
  {
    id: "basicNeeds",
    section: "familia",
    ...choice([
      { v: "nunca", t: "No, nunca" },
      { v: "alguna-vez", t: "Sí, alguna vez" },
      { v: "temporadas", t: "Sí, durante largas temporadas" },
      { v: "ahora", t: "Sí, actualmente" },
    ]),
    short: "Preocupación por necesidades básicas",
    title: "¿En algún momento de tu vida has tenido que preocuparte por cubrir necesidades básicas como alimentación o vivienda?",
  },
  {
    id: "supportNetwork",
    section: "familia",
    ...choice([
      { v: "solida", t: "Sí, sólida", d: "Podría contar con ella sin problema" },
      { v: "limitada", t: "Sí, pero limitada", d: "Ayudaría, pero no para todo" },
      { v: "no", t: "No" },
    ]),
    short: "Red de apoyo ante imprevistos",
    title: "¿Dispones de red de apoyo familiar o económico ante imprevistos graves?",
  },

  // ---------- Economía y finanzas ----------
  {
    id: "childhoodHome",
    section: "economia",
    ...choice([
      { v: "propiedad", t: "Sí, era nuestra" },
      { v: "alquiler-estable", t: "Alquiler estable" },
      { v: "alquiler-inestable", t: "Alquiler inestable", d: "Mudanzas frecuentes, impagos o riesgo de desahucio" },
      { v: "otra", t: "Otra situación", d: "Alquiler social, ocupación, orfanato…" },
    ]),
    short: "Vivienda familiar en tu infancia",
    title: "¿Tu familia era dueña de su vivienda durante tu infancia, o vivíais de alquiler?",
  },
  {
    id: "realEstate",
    section: "economia",
    ...choice([
      { v: "ambas", t: "Sí, ya poseo y además heredaré" },
      { v: "poseo", t: "Sí, ya poseo" },
      { v: "heredare", t: "Sí, heredaré" },
      { v: "no", t: "No" },
    ]),
    short: "Bienes inmuebles propios o en herencia",
    title: "¿Posees o heredarás bienes inmuebles?",
  },
  {
    id: "emergencyExpense",
    section: "economia",
    ...choice([
      { v: "si", t: "Sí, sin problema" },
      { v: "costaria", t: "Sí, pero me costaría" },
      { v: "no", t: "No", d: "Necesitaría un préstamo o ayuda" },
    ]),
    short: "Gasto imprevisto de 1.000 €",
    title: "¿Podrías hacer frente a un gasto imprevisto de 1.000 € (o una urgencia médica) mañana mismo sin pedir un préstamo ni entrar en pánico financiero?",
  },
  {
    id: "jobLossSafetyNet",
    section: "economia",
    ...choice([
      { v: "indefinidamente", t: "Sí, indefinidamente" },
      { v: "temporal", t: "Solo durante un tiempo" },
      { v: "no", t: "No" },
    ]),
    short: "Ayuda familiar si pierdes el empleo",
    title: "Si te quedaras sin empleo hoy, ¿podrías vivir con tus padres o recibir ayuda económica de tu familia indefinidamente?",
  },
  {
    id: "financialEducation",
    section: "economia",
    ...choice([
      { v: "inversiones", t: "Se hablaba de inversiones, ahorro y bolsa" },
      { v: "ahorro", t: "Se hablaba de ahorrar, pero poco más" },
      { v: "nada", t: "Apenas se hablaba de dinero" },
      { v: "estres", t: "El dinero era una fuente constante de estrés y supervivencia" },
    ]),
    short: "Educación financiera en casa",
    title: "¿Creciste en un entorno donde se hablaba de inversiones, ahorro o gestión del dinero, o el dinero era una fuente constante de estrés?",
  },
  {
    id: "unpaidInternships",
    section: "economia",
    ...choice([
      { v: "si", t: "Sí, gracias al apoyo de mi familia" },
      { v: "trabajando", t: "Sí, pero trabajando a la vez en otra cosa" },
      { v: "no", t: "No, no me lo podía permitir" },
      { v: "na", t: "No aplica", d: "No he hecho ni buscado prácticas" },
    ]),
    short: "Prácticas no remuneradas",
    title: "¿Pudiste permitirte hacer prácticas no remuneradas (o mal pagadas) para lanzar tu carrera gracias al apoyo económico de tu familia?",
  },

  // ---------- Social y redes de apoyo ----------
  {
    id: "contacts",
    section: "social",
    ...choice([
      { v: "varios", t: "Sí, a varios" },
      { v: "alguno", t: "Sí, a alguno" },
      { v: "no", t: "No" },
    ]),
    short: "Contactos influyentes («enchufes»)",
    title: "Si buscas trabajo, ¿conoces a amigos, familiares o conocidos en puestos directivos o de influencia a los que puedas llamar directamente?",
  },
  {
    id: "familyStructure",
    section: "social",
    ...choice([
      { v: "biparental", t: "Biparental estable", d: "Los dos padres presentes y con tiempo para mí" },
      { v: "ausentes", t: "Biparental, pero con padres ausentes", d: "Por exceso de trabajo u otros motivos" },
      { v: "monoparental", t: "Monoparental" },
      { v: "desestructurada", t: "Desestructurada" },
      { v: "otros", t: "Me crié con otros familiares, en acogida o en un centro" },
    ]),
    short: "Estructura familiar",
    title: "¿En qué tipo de hogar creciste?",
  },
  {
    id: "neighborhood",
    section: "social",
    ...choice([
      { v: "seguro", t: "Seguro y bien equipado", d: "Zonas verdes, buenas infraestructuras y poca delincuencia" },
      { v: "normal", t: "Normal, sin grandes problemas" },
      { v: "problemas", t: "Con algunos problemas sociales" },
      { v: "marginal", t: "Marginal, industrial o con problemas sociales graves" },
    ]),
    short: "Barrio de tu infancia",
    title: "¿Cómo era el barrio en el que creciste?",
  },
  {
    id: "violence",
    section: "social",
    ...choice([
      { v: "nunca", t: "No, nunca" },
      { v: "alguna-vez", t: "Alguna vez" },
      { v: "a-menudo", t: "A menudo" },
      { v: "habitual", t: "Sí, era algo habitual" },
    ]),
    short: "Miedo por tu seguridad física",
    title: "¿Alguna vez has sentido miedo real por tu seguridad física en tu propio hogar o vecindario por la violencia, la criminalidad o las drogas?",
  },
  {
    id: "socialJudgment",
    section: "social",
    ...choice([
      { v: "nunca", t: "Nunca" },
      { v: "rara-vez", t: "Rara vez" },
      { v: "a-veces", t: "A veces" },
      { v: "a-menudo", t: "A menudo" },
      { v: "siempre", t: "Constantemente" },
    ]),
    short: "Prejuicios por quién eres",
    title: "¿Con qué frecuencia sientes que tu palabra, tus opiniones o tu apariencia se cuestionan o se prejuzgan por quién eres?",
  },

  // ---------- Cultural y educativo ----------
  {
    id: "books",
    section: "cultural",
    ...choice([
      { v: "muchos", t: "Sí", d: "Muchos libros, y se fomentaban la lectura, el arte y el pensamiento crítico" },
      { v: "algunos", t: "Algunos", d: "Se leía de vez en cuando" },
      { v: "pocos", t: "Casi ninguno" },
    ]),
    short: "Libros y estímulos en casa",
    title: "¿Había una biblioteca considerable en tu casa durante tu infancia, y se fomentaba la lectura, el arte y el pensamiento crítico?",
  },
  {
    id: "extracurricular",
    section: "cultural",
    ...choice([
      { v: "varias", t: "Sí, varias", d: "Incluidos viajes al extranjero" },
      { v: "alguna", t: "Alguna" },
      { v: "ninguna", t: "Ninguna" },
    ]),
    short: "Actividades extraescolares",
    title: "¿Pudiste ir a clases de música, deportes privados, campamentos de verano o aprender idiomas (con viajes al extranjero) durante tu etapa escolar?",
  },
  {
    id: "accent",
    section: "cultural",
    ...choice([
      { v: "estandar", t: "Hablo con el acento considerado «estándar»" },
      { v: "acento-sin", t: "Tengo acento, pero nunca me ha perjudicado" },
      { v: "discriminacion", t: "He sufrido burlas o discriminación por cómo hablo" },
    ]),
    short: "Acento e idioma",
    title: "¿Tu acento o tu dominio del idioma oficial (o del inglés) encajan con el estándar «prestigioso», o has sufrido discriminación o burlas por cómo hablas?",
  },
  {
    id: "roleModels",
    section: "cultural",
    ...choice([
      { v: "varios", t: "Sí, varios" },
      { v: "alguno", t: "Sí, alguno" },
      { v: "no", t: "No", d: "Fui de los primeros de mi familia en llegar a la universidad, o no llegué" },
    ]),
    short: "Referentes universitarios cercanos",
    title: "¿Tenías referentes cercanos (padres, tíos, hermanos mayores) con estudios universitarios que te guiaran por el sistema educativo?",
  },
  {
    id: "technology",
    section: "cultural",
    ...choice([
      { v: "pronto", t: "Sí, desde pequeño" },
      { v: "tarde", t: "Sí, pero ya de adolescente" },
      { v: "compartido", t: "Compartido con la familia" },
      { v: "no", t: "No" },
    ]),
    short: "Ordenador e internet",
    title: "¿Tuviste ordenador propio e internet rápido en tu habitación desde pequeño para tus estudios?",
  },

  // ---------- Salud, bienestar y biología ----------
  {
    id: "chronicCondition",
    section: "salud",
    ...choice([
      { v: "no", t: "No" },
      { v: "leve", t: "Sí, pero apenas me limita" },
      { v: "limita", t: "Sí, y limita mis oportunidades" },
      { v: "coste", t: "Sí, me limita y ha supuesto un coste económico elevado", d: "Por ejemplo, ELA" },
    ]),
    short: "Enfermedad crónica o discapacidad",
    title: "¿Tienes alguna enfermedad crónica, discapacidad o condición médica que limite tus oportunidades o haya supuesto un coste elevado para ti o tu familia?",
  },
  {
    id: "mentalHealth",
    section: "salud",
    ...choice([
      { v: "privada", t: "Sí, terapia privada cuando la he necesitado" },
      { v: "publica", t: "Solo a través de la sanidad pública" },
      { v: "inaccesible", t: "No, ha sido un lujo inaccesible" },
      { v: "no-necesario", t: "Nunca lo he necesitado" },
    ]),
    short: "Acceso a salud mental",
    title: "¿Has tenido acceso a terapia psicológica o apoyo emocional profesional cuando lo has necesitado?",
  },
  {
    id: "nutrition",
    section: "salud",
    ...choice([
      { v: "siempre", t: "Sí, siempre" },
      { v: "casi", t: "Casi siempre" },
      { v: "no-siempre", t: "No siempre" },
      { v: "no", t: "A menudo no" },
    ]),
    short: "Alimentación en tu infancia",
    title: "¿Creciste con acceso garantizado a una alimentación equilibrada, fresca y de calidad?",
  },
  {
    id: "appearance",
    section: "salud",
    ...choice([
      { v: "si", t: "Sí, encajo en los cánones" },
      { v: "mas-o-menos", t: "Más o menos" },
      { v: "no", t: "No, y lo he notado en el trabajo o en el trato" },
    ]),
    short: "Cánones estéticos",
    title: "¿Tu cuerpo encaja en los cánones estéticos dominantes (altura, peso, simetría, tipo de pelo), lo que te libra de la discriminación por apariencia?",
  },

  // ---------- Pareja, sexualidad e hijos ----------
  {
    id: "orientation",
    section: "pareja",
    ...choice([
      { v: "heterosexual", t: "Heterosexual" },
      { v: "gay", t: "Gay" },
      { v: "lesbiana", t: "Lesbiana" },
      { v: "bisexual", t: "Bisexual" },
      { v: "pansexual", t: "Pansexual", d: "Atracción sin importar el sexo o el género" },
      { v: "omnisexual", t: "Omnisexual" },
      { v: "polisexual", t: "Polisexual", d: "Atracción por varios géneros, no todos" },
      { v: "asexual", t: "Asexual", d: "Poca o ninguna atracción sexual" },
      { v: "demisexual", t: "Demisexual", d: "Atracción solo tras un vínculo emocional" },
      { v: "grisexual", t: "Grisexual", d: "Entre la asexualidad y la atracción sexual" },
      { v: "arromantica", t: "Arromántico", d: "Poca o ninguna atracción romántica" },
      { v: "heteroflexible", t: "Heteroflexible" },
      { v: "homoflexible", t: "Homoflexible" },
      { v: "androsexual", t: "Androsexual", d: "Atracción por la masculinidad" },
      { v: "ginosexual", t: "Ginosexual", d: "Atracción por la feminidad" },
      { v: "queer", t: "Queer" },
      { v: "cuestionando", t: "Me lo estoy cuestionando" },
      { v: "otra", t: "Otra" },
      NO_ANSWER,
    ]),
    short: "Orientación sexual",
    title: "¿Cuál es tu orientación sexual?",
  },
  {
    id: "virgin",
    section: "pareja",
    ...choice([{ v: "si", t: "Sí" }, { v: "no", t: "No" }]),
    short: "Virgen",
    title: "¿Eres virgen?",
  },
  {
    // Si eres virgen no aparece: cuentas como 0 parejas (tramo «de 0 a 10»).
    id: "sexualPartners",
    section: "pareja",
    showIf: (a) => a.virgin === "no",
    ...choice([
      { v: "0-10", t: "Hasta 10" },
      { v: "10-100", t: "Entre 11 y 100" },
      { v: "100+", t: "Más de 100" },
    ]),
    short: "Parejas sexuales",
    title: "¿Cuántas parejas sexuales has tenido?",
  },
  {
    id: "maritalStatus",
    section: "pareja",
    ...choice([
      { v: "soltero", t: "Soltero" },
      { v: "pareja", t: "En pareja, sin casar" },
      { v: "prometido", t: "Prometido" },
      { v: "casado", t: "Casado" },
      { v: "divorciado", t: "Divorciado o separado" },
      { v: "viudo", t: "Viudo" },
    ]),
    short: "Estado sentimental",
    title: "¿Cuál es tu estado sentimental?",
  },
  {
    id: "children",
    section: "pareja",
    ...choice(COUNT),
    short: "Número de hijos",
    title: "¿Cuántos hijos tienes?",
  },
  {
    id: "childrenOutsideMarriage",
    section: "pareja",
    showIf: (a) => a.children && a.children !== "0" && a.maritalStatus === "casado",
    ...choice(COUNT),
    short: "Hijos de fuera del matrimonio",
    title: "¿Cuántos de tus hijos son de fuera del matrimonio?",
  },
  {
    id: "childrenFromPartnerEx",
    section: "pareja",
    showIf: (a) => a.children && a.children !== "0",
    ...choice(COUNT),
    short: "Hijos de una pareja anterior de tu pareja",
    title: "¿Cuántos de tus hijos son de una pareja anterior de tu pareja?",
  },

  // ---------- Situación legal ----------
  {
    id: "legalStatus",
    section: "legal",
    ...choice([
      { v: "nacionalidad", t: "Legal: tengo la nacionalidad" },
      { v: "residencia", t: "Legal: con permiso de residencia o visado" },
      { v: "tramite", t: "En trámite" },
      { v: "irregular", t: "Irregular", d: "Sin papeles" },
    ]),
    short: "Situación legal",
    title: "¿Estás de forma legal o ilegal en el país donde resides?",
  },
  {
    id: "nationalityPath",
    section: "legal",
    ...choice([
      { v: "nacimiento", t: "Nací con la nacionalidad" },
      { v: "facil", t: "La obtuve sin grandes dificultades" },
      { v: "dificil", t: "He pasado por procesos largos o difíciles", d: "Visados, papeles, esperas…" },
      { v: "barreras", t: "He sufrido racismo institucional o barreras graves" },
      { v: "sin-regularizar", t: "Sigo sin poder regularizar mi situación" },
    ]),
    short: "Nacionalidad y barreras",
    title: "¿Naciste con la nacionalidad del país en el que resides, o has tenido que enfrentarte a burocracia, visados, racismo institucional o barreras para regularizar tu situación?",
  },
  {
    id: "prison",
    section: "legal",
    ...choice([
      { v: "no", t: "No" },
      { v: "menos-1", t: "Sí, menos de un año" },
      { v: "mas-1", t: "Sí, más de un año" },
    ]),
    short: "Prisión",
    title: "¿Has estado en prisión?",
  },
];
