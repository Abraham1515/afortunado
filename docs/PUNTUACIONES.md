# Puntuaciones del cuestionario

> **Estado: programado.** La web calcula estos puntos (`src/lib/score.js`) y los muestra en el resultado, junto al porcentaje según el IDH del país.

Cada respuesta suma o resta puntos, y el resultado final es la suma de todas.

## Índice

1. [País de nacimiento](#1-país-de-nacimiento)
2. [Tú y tu origen](#2-tú-y-tu-origen)
3. [Familia e infancia](#3-familia-e-infancia)
4. [Economía y finanzas](#4-economía-y-finanzas)
5. [Social y redes de apoyo](#5-social-y-redes-de-apoyo)
6. [Cultural y educativo](#6-cultural-y-educativo)
7. [Salud, bienestar y biología](#7-salud-bienestar-y-biología)
8. [Pareja, sexualidad e hijos](#8-pareja-sexualidad-e-hijos)
9. [Situación legal](#9-situación-legal)
10. [Rango del resultado](#10-rango-del-resultado)
11. [Decisiones pendientes](#11-decisiones-pendientes)
12. [Veredicto](#12-veredicto)
13. [Anexo: puntos de cada país y territorio](#anexo-puntos-de-cada-país-y-territorio)

---

## 1. País de nacimiento

De **−25 a +25**, según el Índice de Desarrollo Humano (IDH) del PNUD, por tramos:


| IDH            | Puntos  | Ejemplos                                |
| -------------- | ------- | --------------------------------------- |
| 0,940 o más    | **+25** | Noruega, Suiza, Singapur, Alemania      |
| 0,900 – 0,939  | **+20** | España, Francia, Japón, Estados Unidos  |
| 0,850 – 0,899  | **+18** | Polonia, Portugal, Chile, Arabia Saudí  |
| 0,780 – 0,849  | **+15** | China, Argentina, Rusia, Rumanía        |
| 0,740 – 0,779  | **+10** | México, Brasil, Colombia, Perú          |
| 0,690 – 0,739  | **+5**  | Marruecos, Egipto, Indonesia, Filipinas |
| 0,650 – 0,689  | **0**   | Bangladés, Irak, Guatemala              |
| 0,600 – 0,649  | **−10** | India, Kenia, Ghana, Nepal              |
| 0,500 – 0,599  | **−15** | Camerún, Nigeria, Pakistán, Haití       |
| 0,450 – 0,499  | **−20** | Etiopía, Madagascar, Afganistán         |
| menos de 0,450 | **−25** | Chad, Somalia, Níger, Yemen             |


Casos especiales:


| Caso                                                           | Puntos                                      |
| -------------------------------------------------------------- | ------------------------------------------- |
| Cuba                                                           | **−20** (fijado a mano; por IDH serían +10) |
| Corea del Norte                                                | **−25** (fijado a mano; sin IDH)            |
| Sáhara Occidental                                              | **−20** (sin IDH)                           |
| Kosovo                                                         | **−10** (sin IDH)                           |
| Chipre del Norte                                               | **−15** (sin IDH)                           |
| Territorios dependientes (Groenlandia, Puerto Rico, Bermudas…) | Los del país del que dependen               |
| Lugares deshabitados (Antártida, Vaticano…)                    | **0**                                       |


La lista completa de los 241 países y territorios está en el [anexo](#anexo-puntos-de-cada-país-y-territorio).

## 2. Tú y tu origen


| Pregunta                                                                                     | Respuesta → puntos                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Cuál es tu sexo de nacimiento?                                                              | Hombre **0** · Mujer **+5**                                                                                                                                                                                         |
| ¿De qué raza eres?                                                                           | Ver la tabla [puntos por raza](#puntos-por-raza), justo debajo                                                                                                                                                      |
| ¿Tienes el mismo origen étnico que el país al que perteneces?                                | Sí **+25** · No **−25**                                                                                                                                                                                             |
| ¿Tienen tus padres el mismo origen étnico entre ellos?                                       | Sí **+10** · No **−10**                                                                                                                                                                                             |
| ¿Cuál es la lengua materna que se hablaba en tu hogar?                                       | Inglés **+25** · Chino **+20** · Hindi **+15** · Español **+10** · Árabe **+5** · Francés **0** · Bengalí **−5** · Portugués **−10** · Indonesio **−15** · Urdu **−20** · Cualquier otra **−25**                     |
| ¿Cuál es tu religión?                                                                        | Catolicismo **+25** · Ortodoxo **+20** · Protestante **+15** · Cristianos independientes **+10** · Budismo mahayana **−30** · Visnuismo **−35** · Shivismo **−35** · Shaktismo **−40** · Islam suní **−45** · Ateo **−50** · Otra religión **−75** |
| ¿Tu cultura o religión coincide con la hegemónica, o perteneces a una minoría estigmatizada? | Mayoritaria **+15** · Minoría sin estigma **0** · Minoría estigmatizada **−15**                                                                                                                                     |


En la web, la lengua materna es una lista cerrada con estas opciones («Chino» incluye mandarín, cantonés y otras variedades). Si en casa se hablaba más de una, se elige la principal.

### Puntos por raza

> Blanco, Indígena, Asiático y Negro son categorías: no puntúan por sí mismas, hay que elegir un subgrupo.


| Grupo                 | Subgrupo                                         | Puntos |
| --------------------- | ------------------------------------------------ | ------ |
| **Blanco**            | *(categoría: elige subgrupo)*                    | —      |
|                       | Norte de Europa y Escandinavia                   | +35    |
|                       | Centro y oeste de Europa                         | +10    |
|                       | Mediterráneo                                     | +15    |
|                       | Este de Europa                                   | +5     |
|                       | Cáucaso y otros grupos de la diáspora occidental | 0      |
| **Indígena**          | *(categoría: elige subgrupo)*                    | —      |
|                       | Pueblo gitano, Roma y Travellers                 | −40    |
|                       | América del Norte                                | −20    |
|                       | América Latina y Central                         | −10    |
|                       | Oceanía                                          | 0      |
|                       | Ártico y circumpolar                             | −20    |
|                       | Ainu y Asia septentrional                        | −20    |
| **Asiático**          | *(categoría: elige subgrupo)*                    | —      |
|                       | Sur de Asia (subcontinente indio)                | −55    |
|                       | Este de Asia                                     | +25    |
|                       | Sudeste asiático                                 | +15    |
|                       | Oriente Medio y Asia occidental                  | −45    |
|                       | Asia central                                     | −10    |
| **Negro**             | *(categoría: elige subgrupo)*                    | —      |
|                       | África occidental                                | −45    |
|                       | África oriental                                  | −55    |
|                       | África central                                   | −55    |
|                       | África austral                                   | −45    |
|                       | Pueblos cazadores-recolectores y pastores        | −75    |
|                       | Afrocaribeño                                     | −25    |
|                       | Afroamericano y afrolatino                       | −20    |
|                       | Afroeuropeo                                      | −15    |
| **Latino / hispano**  | —                                                | −10    |
| **Negro mulato**      | —                                                | −45    |
| **Mixto**             | —                                                | −35    |
| **Otro grupo étnico** | —                                                | −35    |


## 3. Familia e infancia


| Pregunta                                                         | Respuesta → puntos                                                                                          |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ¿En qué tipo de zona viviste durante tu infancia?                | Urbana **+10** · Suburbana **+5** · Rural **−10**                                                           |
| ¿Nivel educativo máximo de tus padres?                           | Sin estudios **−8** · Primaria **−5** · Secundaria **0** · FP **+2** · Universidad **+6** · Posgrado **+8** |
| ¿Situación económica de tu familia en tu adolescencia?           | Muy difícil **−40** · Justa **−20** · Media **0** · Acomodada **+75** · Alta **+100**                       |
| ¿Educación privada o universidad sin trabajar a tiempo completo? | Las dos **+55** · Solo privada **+35** · Solo universidad **+35** · Ninguna **−50**                         |
| ¿Has tenido que preocuparte por cubrir necesidades básicas?      | Nunca **+35** · Alguna vez **−30** · Largas temporadas **−80** · Actualmente **−120**                       |
| ¿Dispones de red de apoyo ante imprevistos graves?               | Sólida **+80** · Limitada **0** · No **−80**                                                                |


## 4. Economía y finanzas


| Pregunta                                                             | Respuesta → puntos                                                                                                                           |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Tu familia era dueña de su vivienda durante tu infancia?            | En propiedad **+35** · Alquiler estable **0** · Alquiler inestable **−60** · Otra situación (alquiler social, ocupación, orfanato…) **−150** |
| ¿Posees o heredarás bienes inmuebles?                                | Posees y heredarás **+100** · Posees **+60** · Heredarás **+60** · No **−30**                                                                |
| ¿Podrías afrontar un gasto imprevisto de 1.000 € mañana?             | Sin problema **+5** · Me costaría **0** · No **−60**                                                                                         |
| Si perdieras el empleo, ¿tu familia te mantendría indefinidamente?   | Indefinidamente **+80** · Durante un tiempo **+30** · No **−25**                                                                             |
| ¿Se hablaba de dinero e inversiones en casa, o era fuente de estrés? | Inversiones **+10** · Ahorro **+20** · Apenas se hablaba **−10** · Estrés constante **−25**                                                  |
| ¿Pudiste hacer prácticas no remuneradas gracias a tu familia?        | Sí, con apoyo familiar **+15** · Sí, trabajando a la vez **0** · No me lo podía permitir **−15** · No aplica **0**                           |


## 5. Social y redes de apoyo


| Pregunta                                                                | Respuesta → puntos                                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ¿Conoces a gente influyente a la que llamar si buscas trabajo?          | Varios **+35** · Alguno **+10** · No **−15**                                                                                                     |
| ¿En qué tipo de hogar creciste?                                         | Biparental estable **+35** · Padres ausentes **0** · Monoparental **−30** · Desestructurada **−40** · Otros familiares, acogida o centro **−50** |
| ¿Cómo era el barrio en el que creciste?                                 | Seguro **+5** · Normal **0** · Algunos problemas **−5** · Marginal **−25**                                                                       |
| ¿Has sentido miedo real por tu seguridad física en casa o en el barrio? | Nunca **+15** · Alguna vez **−15** · A menudo **−25** · Habitual **−30**                                                                         |
| ¿Con qué frecuencia te prejuzgan por quién eres?                        | Nunca **+15** · Rara vez **+5** · A veces **−5** · A menudo **−15** · Constantemente **−20**                                                     |


## 6. Cultural y educativo


| Pregunta                                                                  | Respuesta → puntos                                                          |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ¿Había libros en casa y se fomentaba la lectura y el pensamiento crítico? | Sí **+5** · Algunos **+1** · Casi ninguno **−4**                            |
| ¿Hiciste actividades extraescolares, campamentos o idiomas con viajes?    | Varias **+6** · Alguna **+2** · Ninguna **−3**                              |
| ¿Tu acento encaja con el estándar, o te han discriminado por cómo hablas? | Estándar **+3** · Acento sin perjuicio **0** · Discriminación **−5**        |
| ¿Tenías referentes cercanos con estudios universitarios?                  | Varios **+5** · Alguno **+2** · No **−3**                                   |
| ¿Tuviste ordenador propio e internet desde pequeño?                       | Desde pequeño **+4** · De adolescente **+1** · Compartido **0** · No **−4** |


## 7. Salud, bienestar y biología


| Pregunta                                                                | Respuesta → puntos                                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ¿Tienes una enfermedad crónica o discapacidad que te limite?            | No **+45** · Leve **0** · Limita mis oportunidades **−80** · Limitante y con coste elevado (ejemplo: ELA) **−250** |
| ¿Has tenido acceso a terapia o apoyo psicológico cuando lo necesitaste? | Terapia privada **+20** · Solo sanidad pública **+10** · Inaccesible **−10** · Nunca lo he necesitado **+3**       |
| ¿Creciste con una alimentación equilibrada garantizada?                 | Siempre **+4** · Casi siempre **+1** · No siempre **−4** · A menudo no **−8**                                      |
| ¿Encajas en los cánones estéticos dominantes?                           | Sí **+4** · Más o menos **0** · No **−4**                                                                          |


## 8. Pareja, sexualidad e hijos


| Pregunta                                                       | Respuesta → puntos                                                                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ¿Cuál es tu orientación sexual?                                | Heterosexual **+25** · Homosexual (gay o lesbiana) **−25** · Cualquier otra respuesta **−55**                                  |
| ¿Eres virgen?                                                  | Sí: hombre **−35**, mujer **+100** · No: **0**                                                                                 |
| ¿Cuántas parejas sexuales has tenido?                          | Hasta 10: hombre **+5**, mujer **+75** · De 11 a 100: hombre **+7**, mujer **−45** · Más de 100: hombre **+7**, mujer **−95** |
| ¿Cuál es tu estado sentimental?                                | Casado **+35** · En pareja **+15** · Prometido **+20** · Soltero **0** · Divorciado o separado **−20** · Viudo **−30**         |
| ¿Cuántos hijos tienes?                                         | 0 **0** · 1 **+10** · 2 **+20** · 3 **+30** · Más de 3 **+40**                                                                 |
| ¿Cuántos de tus hijos son de fuera del matrimonio?             | 0 **0** · 1 **−20** · 2 **−40** · 3 **−60** · Más de 3 **−80**                                                                 |
| ¿Cuántos de tus hijos son de una pareja anterior de tu pareja? | 0 **0** · 1 **−30** · 2 **−60** · 3 **−90** · Más de 3 **−120**                                                                |


- La pregunta de parejas sexuales solo aparece si no eres virgen. Si lo eres, cuentas como 0 parejas: se suman también los puntos del tramo «hasta 10».
- La de hijos de fuera del matrimonio solo aparece si estás casado y tienes hijos; la de hijos de una pareja anterior, si tienes hijos.
- «Cualquier otra respuesta» en orientación incluye «Me lo estoy cuestionando» y «Prefiero no decirlo».


## 9. Situación legal


| Pregunta                                                                            | Respuesta → puntos                                                                                                                       |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| ¿Estás de forma legal o ilegal en el país donde resides?                            | Nacionalidad **+5** · Residencia o visado **0** · En trámite **−5** · Irregular **−35**                                                  |
| ¿Naciste con la nacionalidad, o has tenido que superar barreras para regularizarte? | Nací con ella **+30** · Sin dificultades **+10** · Procesos difíciles **−10** · Racismo institucional **−25** · Sin regularizar **−100** |
| ¿Has estado en prisión?                                                             | No **0** · Menos de un año **−35** · Más de un año **−55**                                                                               |


## 10. Rango del resultado

Sumando la mejor y la peor respuesta de cada pregunta. Es un límite aproximado: algunas combinaciones no se pueden dar a la vez (por ejemplo, ser virgen y tener más de 100 parejas). `npm run check` lo recalcula con los puntos de la web.


| Bloque                      | Mínimo    | Máximo    |
| --------------------------- | --------- | --------- |
| País                        | −25       | +25       |
| Tú y tu origen              | −225      | +140      |
| Familia e infancia          | −308      | +288      |
| Economía y finanzas         | −305      | +255      |
| Social y redes de apoyo     | −140      | +105      |
| Cultural y educativo        | −19       | +23       |
| Salud, bienestar y biología | −272      | +73       |
| Pareja, sexualidad e hijos  | −410      | +350      |
| Situación legal             | −190      | +35       |
| **Total**                   | **−1894** | **+1294** |


## 11. Decisiones pendientes

- **Peso del país:** vale ±25, muy poco frente al resto (cada bloque llega a ±100 o más). Si debe pesar más, hay que multiplicarlo o cambiar sus tramos.
- **Cultural y educativo, alimentación y cánones estéticos** conservan los valores pequeños de la primera propuesta (±3 a ±8), mientras que el resto llega a ±100 o más.
- **Posibles erratas:** Inversiones (+10) puntúa menos que Ahorro (+20); en el gasto imprevisto, «Sin problema» vale +5 y «No» −60; en terapia, «Nunca lo he necesitado» vale +3 y la terapia privada +20.
- **Solapamientos:** la discriminación resta en raza, mismo origen que tu país, minoría estigmatizada y prejuicios; estar sin papeles resta en dos preguntas (−35 y −100).
- **Criterio de Cuba:** por IDH saldría +10. Si se baja por falta de libertades o por la situación económica, habría que decidir si se aplica lo mismo a otros países, como Venezuela, Irán, Siria o Rusia.
- **Porcentaje estimado:** la tarjeta del resultado dice «perteneces al X % más afortunado del planeta» comparando tus puntos con 20.000 personas simuladas (país al azar según su población y el resto de respuestas al azar). No hay datos reales de cómo se reparten estos puntos; si se quiere más realismo, habría que dar a cada respuesta una probabilidad.

## 12. Veredicto

| Percentil              | Veredicto |
| ---------------------- | --------- |
| Top 1 %                | Eres una deidad entre los mortales. Caminas entre la escoria que son los demás seres mortales. |
| Top 10 %               | Siéntete afortunado: tienes aquello con lo que el 90 % del planeta sueña. |
| Del 10 % al 30 %       | No eres de la élite, pero te tocaron buenas cartas: la mayoría del mundo firmaría ahora mismo por tener tu vida. |
| Del 30 % al 40 %       | La lotería te sonrió, aunque sin pasarse: vives mejor que casi todo el planeta, sin lujos que presumir. |
| Del 40 % al 50 %       | Justo por encima de la mitad: la vida no te regaló nada, pero tampoco te lo quitó todo. |
| Por debajo del 50 %    | Te tocó la peor parte del reparto: más de la mitad del planeta salió con mejores cartas que tú. La partida venía amañada desde antes de nacer, y nada de eso es culpa tuya. |

---

## Anexo: puntos de cada país y territorio

Generado a partir de los datos de `src/data/countries.js` (IDH del PNUD, informe 2023/2024) con los tramos de la sección 1. «≈» indica un IDH tomado del país del que depende el territorio.


| País o territorio                         | IDH     | Puntos  | Nota                        |
| ----------------------------------------- | ------- | ------- | --------------------------- |
| Alemania                                  | 0,950   | **+25** |                             |
| Anguila                                   | ≈ 0,940 | **+25** | como Reino Unido            |
| Aruba                                     | ≈ 0,946 | **+25** | como Países Bajos           |
| Australia                                 | 0,946   | **+25** |                             |
| Bélgica                                   | 0,942   | **+25** |                             |
| Bermudas                                  | ≈ 0,940 | **+25** | como Reino Unido            |
| Curazao                                   | ≈ 0,946 | **+25** | como Países Bajos           |
| Dinamarca                                 | 0,952   | **+25** |                             |
| Finlandia                                 | 0,942   | **+25** |                             |
| Gibraltar                                 | ≈ 0,940 | **+25** | como Reino Unido            |
| Groenlandia                               | ≈ 0,952 | **+25** | como Dinamarca              |
| Guernsey                                  | ≈ 0,940 | **+25** | como Reino Unido            |
| Hong Kong                                 | 0,956   | **+25** |                             |
| Irlanda                                   | 0,950   | **+25** |                             |
| Isla de Man                               | ≈ 0,940 | **+25** | como Reino Unido            |
| Isla de Navidad e Islas Cocos             | ≈ 0,946 | **+25** | como Australia              |
| Isla Norfolk                              | ≈ 0,946 | **+25** | como Australia              |
| Islandia                                  | 0,959   | **+25** |                             |
| Islas Caimán                              | ≈ 0,940 | **+25** | como Reino Unido            |
| Islas Feroe                               | ≈ 0,952 | **+25** | como Dinamarca              |
| Islas Malvinas                            | ≈ 0,940 | **+25** | como Reino Unido            |
| Islas Pitcairn                            | ≈ 0,940 | **+25** | como Reino Unido            |
| Islas Turcas y Caicos                     | ≈ 0,940 | **+25** | como Reino Unido            |
| Islas Vírgenes Británicas                 | ≈ 0,940 | **+25** | como Reino Unido            |
| Jersey                                    | ≈ 0,940 | **+25** | como Reino Unido            |
| Liechtenstein                             | 0,942   | **+25** |                             |
| Macao                                     | ≈ 0,956 | **+25** | como Hong Kong              |
| Montserrat                                | ≈ 0,940 | **+25** | como Reino Unido            |
| Noruega                                   | 0,966   | **+25** |                             |
| Países Bajos                              | 0,946   | **+25** |                             |
| Reino Unido                               | 0,940   | **+25** |                             |
| Santa Elena, Ascensión y Tristán de Acuña | ≈ 0,940 | **+25** | como Reino Unido            |
| Singapur                                  | 0,949   | **+25** |                             |
| Sint Maarten                              | ≈ 0,946 | **+25** | como Países Bajos           |
| Suecia                                    | 0,952   | **+25** |                             |
| Suiza                                     | 0,967   | **+25** |                             |
| Austria                                   | 0,926   | **+20** |                             |
| Canadá                                    | 0,935   | **+20** |                             |
| Chipre                                    | 0,907   | **+20** |                             |
| Corea del Sur                             | 0,929   | **+20** |                             |
| Emiratos Árabes Unidos                    | 0,937   | **+20** |                             |
| Eslovenia                                 | 0,926   | **+20** |                             |
| España                                    | 0,911   | **+20** |                             |
| Estados Unidos                            | 0,927   | **+20** |                             |
| Francia                                   | 0,910   | **+20** |                             |
| Guam                                      | ≈ 0,927 | **+20** | como Estados Unidos         |
| Islas Cook                                | ≈ 0,939 | **+20** | como Nueva Zelanda          |
| Islas Marianas del Norte                  | ≈ 0,927 | **+20** | como Estados Unidos         |
| Islas Vírgenes de EE. UU.                 | ≈ 0,927 | **+20** | como Estados Unidos         |
| Israel                                    | 0,915   | **+20** |                             |
| Italia                                    | 0,906   | **+20** |                             |
| Japón                                     | 0,920   | **+20** |                             |
| Luxemburgo                                | 0,927   | **+20** |                             |
| Malta                                     | 0,915   | **+20** |                             |
| Mónaco                                    | ≈ 0,910 | **+20** | como Francia                |
| Niue                                      | ≈ 0,939 | **+20** | como Nueva Zelanda          |
| Nueva Caledonia                           | ≈ 0,910 | **+20** | como Francia                |
| Nueva Zelanda                             | 0,939   | **+20** |                             |
| Polinesia Francesa                        | ≈ 0,910 | **+20** | como Francia                |
| Puerto Rico                               | ≈ 0,927 | **+20** | como Estados Unidos         |
| Samoa Americana                           | ≈ 0,927 | **+20** | como Estados Unidos         |
| San Bartolomé                             | ≈ 0,910 | **+20** | como Francia                |
| San Martín                                | ≈ 0,910 | **+20** | como Francia                |
| San Pedro y Miquelón                      | ≈ 0,910 | **+20** | como Francia                |
| Taiwán                                    | 0,926   | **+20** |                             |
| Tokelau                                   | ≈ 0,939 | **+20** | como Nueva Zelanda          |
| Wallis y Futuna                           | ≈ 0,910 | **+20** | como Francia                |
| Andorra                                   | 0,884   | **+18** |                             |
| Arabia Saudí                              | 0,875   | **+18** |                             |
| Baréin                                    | 0,888   | **+18** |                             |
| Catar                                     | 0,875   | **+18** |                             |
| Chequia                                   | 0,895   | **+18** |                             |
| Chile                                     | 0,860   | **+18** |                             |
| Croacia                                   | 0,878   | **+18** |                             |
| Eslovaquia                                | 0,855   | **+18** |                             |
| Estonia                                   | 0,899   | **+18** |                             |
| Grecia                                    | 0,893   | **+18** |                             |
| Hungría                                   | 0,851   | **+18** |                             |
| Letonia                                   | 0,879   | **+18** |                             |
| Lituania                                  | 0,879   | **+18** |                             |
| Polonia                                   | 0,881   | **+18** |                             |
| Portugal                                  | 0,874   | **+18** |                             |
| San Marino                                | 0,867   | **+18** |                             |
| Turquía                                   | 0,855   | **+18** |                             |
| Albania                                   | 0,789   | **+15** |                             |
| Antigua y Barbuda                         | 0,826   | **+15** |                             |
| Argentina                                 | 0,849   | **+15** |                             |
| Armenia                                   | 0,786   | **+15** |                             |
| Bahamas                                   | 0,820   | **+15** |                             |
| Barbados                                  | 0,809   | **+15** |                             |
| Bielorrusia                               | 0,801   | **+15** |                             |
| Brunéi                                    | 0,823   | **+15** |                             |
| Bulgaria                                  | 0,799   | **+15** |                             |
| China                                     | 0,788   | **+15** |                             |
| Chipre del Norte                          | —       | **−15** | a mano (sin IDH)            |
| Costa Rica                                | 0,806   | **+15** |                             |
| Georgia                                   | 0,814   | **+15** |                             |
| Granada                                   | 0,793   | **+15** |                             |
| Irán                                      | 0,780   | **+15** |                             |
| Kazajistán                                | 0,802   | **+15** |                             |
| Kuwait                                    | 0,847   | **+15** |                             |
| Malasia                                   | 0,807   | **+15** |                             |
| Mauricio                                  | 0,796   | **+15** |                             |
| México                                    | 0,781   | **+15** |                             |
| Montenegro                                | 0,844   | **+15** |                             |
| Omán                                      | 0,819   | **+15** |                             |
| Palaos                                    | 0,797   | **+15** |                             |
| Panamá                                    | 0,820   | **+15** |                             |
| Rumanía                                   | 0,827   | **+15** |                             |
| Rusia                                     | 0,821   | **+15** |                             |
| San Cristóbal y Nieves                    | 0,838   | **+15** |                             |
| Serbia                                    | 0,805   | **+15** |                             |
| Seychelles                                | 0,802   | **+15** |                             |
| Sri Lanka                                 | 0,780   | **+15** |                             |
| Tailandia                                 | 0,803   | **+15** |                             |
| Trinidad y Tobago                         | 0,814   | **+15** |                             |
| Uruguay                                   | 0,830   | **+15** |                             |
| Argelia                                   | 0,745   | **+10** |                             |
| Azerbaiyán                                | 0,760   | **+10** |                             |
| Bosnia y Herzegovina                      | 0,779   | **+10** |                             |
| Brasil                                    | 0,760   | **+10** |                             |
| Colombia                                  | 0,758   | **+10** |                             |
| Dominica                                  | 0,740   | **+10** |                             |
| Ecuador                                   | 0,765   | **+10** |                             |
| Guyana                                    | 0,742   | **+10** |                             |
| Kosovo                                    | —       | **−10** | a mano (sin IDH)            |
| Libia                                     | 0,746   | **+10** |                             |
| Macedonia del Norte                       | 0,765   | **+10** |                             |
| Maldivas                                  | 0,762   | **+10** |                             |
| Moldavia                                  | 0,763   | **+10** |                             |
| Mongolia                                  | 0,741   | **+10** |                             |
| Perú                                      | 0,762   | **+10** |                             |
| República Dominicana                      | 0,766   | **+10** |                             |
| San Vicente y las Granadinas              | 0,772   | **+10** |                             |
| Tonga                                     | 0,769   | **+10** |                             |
| Turkmenistán                              | 0,744   | **+10** |                             |
| Belice                                    | 0,700   | **+5**  |                             |
| Bolivia                                   | 0,698   | **+5**  |                             |
| Botsuana                                  | 0,708   | **+5**  |                             |
| Egipto                                    | 0,728   | **+5**  |                             |
| Filipinas                                 | 0,710   | **+5**  |                             |
| Fiyi                                      | 0,729   | **+5**  |                             |
| Gabón                                     | 0,693   | **+5**  |                             |
| Indonesia                                 | 0,713   | **+5**  |                             |
| Islas Marshall                            | 0,731   | **+5**  |                             |
| Jamaica                                   | 0,706   | **+5**  |                             |
| Jordania                                  | 0,736   | **+5**  |                             |
| Kirguistán                                | 0,701   | **+5**  |                             |
| Líbano                                    | 0,723   | **+5**  |                             |
| Marruecos                                 | 0,698   | **+5**  |                             |
| Nauru                                     | 0,696   | **+5**  |                             |
| Palestina                                 | 0,716   | **+5**  |                             |
| Paraguay                                  | 0,731   | **+5**  |                             |
| Samoa                                     | 0,702   | **+5**  |                             |
| Santa Lucía                               | 0,725   | **+5**  |                             |
| Sudáfrica                                 | 0,717   | **+5**  |                             |
| Surinam                                   | 0,690   | **+5**  |                             |
| Túnez                                     | 0,732   | **+5**  |                             |
| Ucrania                                   | 0,734   | **+5**  |                             |
| Uzbekistán                                | 0,727   | **+5**  |                             |
| Venezuela                                 | 0,699   | **+5**  |                             |
| Vietnam                                   | 0,726   | **+5**  |                             |
| Antártida                                 | —       | **0**   | deshabitado                 |
| Bangladés                                 | 0,670   | **0**   |                             |
| Bután                                     | 0,681   | **0**   |                             |
| Cabo Verde                                | 0,661   | **0**   |                             |
| Ciudad del Vaticano                       | —       | **0**   | deshabitado                 |
| El Salvador                               | 0,674   | **0**   |                             |
| Georgias del Sur y Sandwich del Sur       | —       | **0**   | deshabitado                 |
| Glaciar de Siachen                        | —       | **0**   | deshabitado                 |
| Guinea Ecuatorial                         | 0,650   | **0**   |                             |
| Irak                                      | 0,673   | **0**   |                             |
| Islas Heard y McDonald                    | —       | **0**   | deshabitado                 |
| Nicaragua                                 | 0,669   | **0**   |                             |
| Tayikistán                                | 0,679   | **0**   |                             |
| Territorio Británico del Océano Índico    | —       | **0**   | deshabitado                 |
| Tierras Australes y Antárticas Francesas  | —       | **0**   | deshabitado                 |
| Tuvalu                                    | 0,653   | **0**   |                             |
| Camboya                                   | 0,600   | **−10** |                             |
| Esuatini                                  | 0,610   | **−10** |                             |
| Ghana                                     | 0,602   | **−10** |                             |
| Guatemala                                 | 0,629   | **−10** |                             |
| Honduras                                  | 0,624   | **−10** |                             |
| India                                     | 0,644   | **−10** |                             |
| Kenia                                     | 0,601   | **−10** |                             |
| Laos                                      | 0,620   | **−10** |                             |
| Micronesia                                | 0,634   | **−10** |                             |
| Myanmar                                   | 0,608   | **−10** |                             |
| Namibia                                   | 0,610   | **−10** |                             |
| Nepal                                     | 0,601   | **−10** |                             |
| Santo Tomé y Príncipe                     | 0,613   | **−10** |                             |
| Vanuatu                                   | 0,614   | **−10** |                             |
| Angola                                    | 0,591   | **−15** |                             |
| Benín                                     | 0,504   | **−15** |                             |
| Camerún                                   | 0,587   | **−15** |                             |
| Comoras                                   | 0,586   | **−15** |                             |
| Congo                                     | 0,593   | **−15** |                             |
| Costa de Marfil                           | 0,534   | **−15** |                             |
| Haití                                     | 0,552   | **−15** |                             |
| Islas Salomón                             | 0,562   | **−15** |                             |
| Kiribati                                  | 0,570   | **−15** |                             |
| Lesoto                                    | 0,521   | **−15** |                             |
| Malaui                                    | 0,508   | **−15** |                             |
| Mauritania                                | 0,540   | **−15** |                             |
| Nigeria                                   | 0,548   | **−15** |                             |
| Pakistán                                  | 0,540   | **−15** |                             |
| Papúa Nueva Guinea                        | 0,568   | **−15** |                             |
| Ruanda                                    | 0,548   | **−15** |                             |
| Senegal                                   | 0,517   | **−15** |                             |
| Siria                                     | 0,557   | **−15** |                             |
| Sudán                                     | 0,516   | **−15** |                             |
| Tanzania                                  | 0,532   | **−15** |                             |
| Timor Oriental                            | 0,566   | **−15** |                             |
| Togo                                      | 0,547   | **−15** |                             |
| Uganda                                    | 0,550   | **−15** |                             |
| Yibuti                                    | 0,515   | **−15** |                             |
| Zambia                                    | 0,569   | **−15** |                             |
| Zimbabue                                  | 0,550   | **−15** |                             |
| Afganistán                                | 0,462   | **−20** |                             |
| Cuba                                      | 0,764   | **−20** | a mano (por IDH serían +10) |
| Eritrea                                   | 0,493   | **−20** |                             |
| Etiopía                                   | 0,492   | **−20** |                             |
| Gambia                                    | 0,495   | **−20** |                             |
| Guinea                                    | 0,471   | **−20** |                             |
| Guinea-Bisáu                              | 0,483   | **−20** |                             |
| Liberia                                   | 0,487   | **−20** |                             |
| Madagascar                                | 0,487   | **−20** |                             |
| Mozambique                                | 0,461   | **−20** |                             |
| R. D. del Congo                           | 0,481   | **−20** |                             |
| Sáhara Occidental                         | —       | **−20** | a mano (sin IDH)            |
| Sierra Leona                              | 0,458   | **−20** |                             |
| Burkina Faso                              | 0,438   | **−25** |                             |
| Burundi                                   | 0,420   | **−25** |                             |
| Chad                                      | 0,394   | **−25** |                             |
| Corea del Norte                           | —       | **−25** | a mano (sin IDH)            |
| Malí                                      | 0,410   | **−25** |                             |
| Níger                                     | 0,394   | **−25** |                             |
| República Centroafricana                  | 0,387   | **−25** |                             |
| Somalia                                   | 0,380   | **−25** |                             |
| Sudán del Sur                             | 0,381   | **−25** |                             |
| Yemen                                     | 0,424   | **−25** |                             |


