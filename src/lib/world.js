// Países del mapa listos para dibujar, con las fronteras corregidas.
// Mapa 1:50m: incluye microestados e islas pequeñas (Singapur, Malta, Andorra, el Caribe…).
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-50m.json";
import { fixBorders } from "./borders.js";
import { UNCODED } from "../data/countries.js";

const topo = fixBorders(structuredClone(worldData));

export const features = feature(topo, topo.objects.countries).features
  .filter((f) => f.id !== "010") // la Antártida no se dibuja (sí se puede elegir en el buscador)
  .map((f) => Object.assign(f, { key: UNCODED[f.properties.name] ?? f.id ?? null }));

// Lugares demasiado pequeños para tener forma en el mapa 1:50m: se dibujan como un punto.
export const points = [
  { id: "292", coords: [-5.35, 36.14] },   // Gibraltar
  { id: "798", coords: [179.2, -8.52] },   // Tuvalu
  { id: "772", coords: [-171.85, -9.2] },  // Tokelau
];
