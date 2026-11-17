# ¿Cómo de afortunado eres?

Cuestionario con un mapamundi tipo radar que te dice qué parte de la humanidad nació en un lugar menos favorable que el tuyo.

Hecho con [Vue 3](https://vuejs.org) + [Vite](https://vite.dev), [D3](https://d3js.org) para el mapa y los datos de [world-atlas](https://github.com/topojson/world-atlas) (Natural Earth 1:50m).

## Cómo arrancarlo

Necesitas [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Genera la versión final en `dist/` |
| `npm run preview` | Sirve `dist/` para probarla |
| `npm run check` | Comprueba los datos y las fronteras (falla si algo no cuadra) |

## Preguntas

44 preguntas en 8 secciones, todas en `src/questions.js`:

| Sección | Preguntas |
| --- | --- |
| Tú y tu origen | 8: país de nacimiento, sexo, raza, origen, lengua, religión… |
| Familia e infancia | 6 |
| Economía y finanzas | 6 |
| Social y redes de apoyo | 5 |
| Cultural y educativo | 5 |
| Salud, bienestar y biología | 4 |
| Pareja, sexualidad e hijos | 7 (3 solo aparecen según respuestas anteriores) |
| Situación legal | 3 |

- **País:** se elige en el buscador (sin importar tildes) o pulsando el mapa. Hay 241 lugares: todos los países y también territorios como Groenlandia, el Sáhara Occidental o las islas más pequeñas.
- **Raza:** grupo y subgrupo (Blanco, Indígena, Asiático y Negro son categorías: hay que elegir subgrupo). "Mixto" permite marcar varios grupos.
- Si los padres tienen orígenes distintos, el resultado indica que eres mestizo.
- Las respuestas no se guardan ni se envían: todo ocurre en el navegador.

Al terminar aparece una **tarjeta con tus puntos de suerte** (la suma de los puntos del país y de cada respuesta), el **porcentaje estimado** («perteneces al 0,9 % más afortunado del planeta»), un **veredicto** y el desglose de lo que puntuaba cada opción. El porcentaje compara tus puntos con 20.000 personas simuladas (país al azar según su población y el resto de respuestas al azar): no hay datos reales de cómo se reparten. Debajo sigue el porcentaje de suerte según el IDH del país. Los puntos están en [docs/PUNTUACIONES.md](docs/PUNTUACIONES.md) y en `src/lib/score.js`; `npm run check` avisa si alguna opción se queda sin puntos.

Para añadir una pregunta, añade un objeto a `QUESTIONS` en `src/questions.js`. Tipos disponibles: `country`, `ethnicity`, `yesno`, y `choice` (opciones cerradas). Cada pregunta nueva necesita sus puntos en `POINTS` (`src/lib/score.js`). Con `showIf` la pregunta solo aparece si se cumple una condición sobre las respuestas anteriores.

## Cómo se calcula

- **Más afortunado que el X%** = porcentaje de la población mundial que vive en países con un Índice de Desarrollo Humano (IDH) menor que el tuyo.
- El IDH combina salud (esperanza de vida), educación e ingresos.
- **Territorios sin IDH propio** (Groenlandia, Puerto Rico, Bermudas…): se usa el del país del que dependen como aproximación, y se indica en el resultado.
- **Sin datos fiables** (Sáhara Occidental, Corea del Norte, Kosovo, Chipre del Norte) y **deshabitados** (Antártida…): se pueden elegir, pero no dan porcentaje.

Datos (redondeados, en `src/data/countries.js`):
- IDH y esperanza de vida: PNUD, *Informe sobre Desarrollo Humano 2023/2024* (datos de 2022).
- Población: estimaciones de la ONU para 2023.

## Fronteras

El mapa base (Natural Earth) dibuja fronteras *de facto*. `src/lib/borders.js` las corrige al cargar:
- **Crimea** forma parte de Ucrania.
- **Sáhara Occidental** es un territorio completo e independiente de Marruecos, con la frontera en el paralelo 27°40′ N.

## Estructura

```
src/
  App.vue                      cuestionario y pasos
  questions.js                 todas las preguntas y secciones
  components/
    WorldMap.vue               mapa (zoom, selección, radar)
    CountryPicker.vue          buscador de países
    EthnicityQuestion.vue      pregunta de raza
    ParentsOriginQuestion.vue  origen de los padres
    ChoiceQuestion.vue         opciones cerradas
    YesNoQuestion.vue          preguntas Sí / No
    TextQuestion.vue           texto libre con sugerencias
    ResultPanel.vue            resultado
  data/
    countries.js               IDH, esperanza de vida y población
    ethnicities.js             opciones de la pregunta de origen
  lib/
    luck.js                    cálculo de la suerte
    world.js                   mapa con las fronteras corregidas
    borders.js                 corrección de fronteras
  style.css                    tema radar
scripts/check.mjs              comprobaciones de datos
```
