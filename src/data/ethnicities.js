// Opciones de la pregunta "¿De qué raza eres?".
// Cada grupo puede tener subgrupos con ejemplos; si los tiene, hay que elegir uno.
// "mixto" permite marcar varios grupos; "otro" admite un texto libre.

export const ETHNIC_GROUPS = [
  {
    id: "blanco",
    name: "Blanco",
    subgroups: [
      { id: "norte", name: "Norte de Europa y Escandinavia", examples: "Británicos, irlandeses, escandinavos (suecos, noruegos, daneses, islandeses), finlandeses, bálticos (estonios, letones, lituanos)" },
      { id: "centro", name: "Centro y oeste de Europa", examples: "Alemanes, franceses, neerlandeses, suizos, austríacos, belgas, luxemburgueses" },
      { id: "mediterraneo", name: "Mediterráneo", examples: "Españoles, italianos, portugueses, griegos, malteses, chipriotas, sur de Francia y Balcanes occidentales" },
      { id: "este", name: "Este de Europa", examples: "Polacos, ucranianos, rusos, bielorrusos, checos, eslovacos, húngaros, búlgaros, rumanos, moldavos" },
      { id: "caucaso", name: "Cáucaso y otros grupos de la diáspora occidental", examples: "Georgianos, armenios, azerbaiyanos…" },
    ],
  },
  {
    id: "indigena",
    name: "Indígena",
    subgroups: [
      { id: "roma", name: "Pueblo gitano, Roma y Travellers", examples: "Gitanos, calé, sinti, romnichal, Irish Travellers, Scottish Travellers, yeniches" },
      { id: "norteamerica", name: "América del Norte", examples: "First Nations, innu, inuit, navajos, cheroquis, sioux…" },
      { id: "latinoamerica", name: "América Latina y Central", examples: "Quechuas, aimaras, yanomamis, shipibos, mayas, nahuas, zapotecos, guaraníes, mapuches, gunas…" },
      { id: "oceania", name: "Oceanía", examples: "Aborígenes australianos, isleños del Estrecho de Torres, maoríes, samoanos, fiyianos, tonganos, nativos hawaianos, rapanuis…" },
      { id: "artico", name: "Ártico y circumpolar", examples: "Sami, yakutos, nenets, chukchis y otros pueblos siberianos" },
      { id: "ainu", name: "Ainu y Asia septentrional", examples: "Ainu (Japón), nivjis, itelmenos" },
    ],
  },
  {
    id: "asiatico",
    name: "Asiático",
    subgroups: [
      { id: "sur", name: "Sur de Asia (subcontinente indio)", examples: "Indios, pakistaníes, bangladesíes, ceilandeses, nepalíes, butaneses, maldivos (punyabíes, tamiles, bengalíes, maratíes…)" },
      { id: "este", name: "Este de Asia", examples: "Chinos (han, uigures, tibetanos, hui, mongoles), japoneses, coreanos, taiwaneses" },
      { id: "sudeste", name: "Sudeste asiático", examples: "Filipinos, vietnamitas, tailandeses, indonesios (javaneses, sundaneses, balineses), malayos, birmanos, jemeres, laosianos, hmong, dayak…" },
      { id: "oriente", name: "Oriente Medio y Asia occidental", examples: "Árabes, persas, turcos, kurdos, armenios, asirios/caldeos, yazidíes, drusos, baluchis, pastunes" },
      { id: "central", name: "Asia central", examples: "Kazajos, uzbekos, kirguises, turcomanos, tayikos" },
    ],
  },
  {
    id: "negro",
    name: "Negro",
    subgroups: [
      { id: "occidental", name: "África occidental", examples: "Yorubas, igbos, hausas, akanes, ashantis, wólofs, mandés…" },
      { id: "oriental", name: "África oriental", examples: "Amharas, oromos, kikuyus, somalíes, suajilis…" },
      { id: "central", name: "África central", examples: "Bantúes, kongos, lubas, fang…" },
      { id: "austral", name: "África austral", examples: "Zulúes, xhosas, sothos, tswanas…" },
      { id: "tradicional", name: "Pueblos cazadores-recolectores y pastores", examples: "Masáis, joisanes (san y khoekhoe), pigmeos (mbuti, aka)…" },
      { id: "caribe", name: "Afrocaribeño", examples: "Jamaicanos, haitianos, cubanos, trinitenses, dominicanos…" },
      { id: "america", name: "Afroamericano y afrolatino", examples: "Afroamericanos, afrobrasileños, afrocolombianos, afrouruguayos, afroperuanos, garífunas…" },
      { id: "europa", name: "Afroeuropeo", examples: "Afrobritánicos, afrofranceses, afroespañoles…" },
    ],
  },
  {
    id: "latino",
    name: "Latino / hispano",
    description: "Personas de América Latina o con ascendencia hispana o lusoamericana: una mezcla histórica de herencias indígenas, europeas, africanas y asiáticas (mestizos, criollos, mulatos, zambos).",
    subgroups: [],
  },
  {
    id: "mulato",
    name: "Negro mulato",
    description: "Descendiente de una persona negra y una blanca.",
    subgroups: [],
  },
  {
    id: "mixto",
    name: "Mixto",
    description: "Descendiente de uniones de cualquier combinación (blanco-asiático, negro-asiático, indígena-blanco…). Marca los grupos que se combinan.",
    subgroups: [],
  },
  {
    id: "otro",
    name: "Otro grupo étnico",
    description: "Minorías transnacionales, pueblos apátridas (como los rohinyás o los saharauis) o cualquier otra identidad no contemplada arriba.",
    subgroups: [],
  },
];

export const groupById = Object.fromEntries(ETHNIC_GROUPS.map((g) => [g.id, g]));

// Grupos que se pueden combinar en "Mixto".
export const MIXABLE = ETHNIC_GROUPS.filter((g) => !["mixto", "otro", "mulato"].includes(g.id));

export function isEthnicityAnswered(a) {
  if (!a?.group) return false;
  if (a.group === "mixto") return a.mix.length >= 2;
  if (groupById[a.group].subgroups.length) return !!a.sub; // las categorías exigen subgrupo
  return true;
}

// Texto corto para mostrar la respuesta: "Blanco · Mediterráneo", "Mixto (Blanco + Asiático)"…
export function describeEthnicity(a) {
  if (!isEthnicityAnswered(a)) return "";
  const g = groupById[a.group];
  if (a.group === "mixto") return `Mixto (${a.mix.map((id) => groupById[id].name).join(" + ")})`;
  if (a.group === "otro" && a.other.trim()) return `${g.name}: ${a.other.trim()}`;
  const sub = g.subgroups.find((s) => s.id === a.sub);
  return sub ? `${g.name} · ${sub.name}` : g.name;
}
