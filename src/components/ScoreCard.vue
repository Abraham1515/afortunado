<script setup>
// Tarjeta final: puntos totales, percentil estimado, veredicto y desglose de cada opción.
import { computed } from "vue";
import { scoreAnswers, topPercent, verdict, breakdown, countryPoints, SIMULATED } from "../lib/score.js";
import { SECTIONS } from "../questions.js";

const props = defineProps({
  answers: { type: Object, required: true },
  place: { type: Object, default: null },
  questions: { type: Array, required: true }, // las preguntas que han tocado
});

const score = computed(() => scoreAnswers(props.answers, props.place, props.questions));
const top = computed(() => topPercent(score.value.total));
const v = computed(() => verdict(top.value));

const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : "0");
// 0,9 · 12 · menos de 0,1
const pctText = (p) => (p < 0.1 ? "0,1" : (p < 10 ? p.toFixed(1) : Math.round(p).toString()).replace(".", ","));
const headline = computed(() => (top.value <= 50
  ? `Perteneces al ${pctText(top.value)} % más afortunado del planeta`
  : `El ${pctText(top.value)} % del planeta tuvo más suerte que tú`));

// Desglose por secciones: cada pregunta con todas sus opciones.
const details = computed(() => SECTIONS.map((s) => ({
  ...s,
  points: score.value.sections.find((x) => x.id === s.id)?.points ?? 0,
  questions: props.questions
    .filter((q) => q.section === s.id && q.id !== "birthplace")
    .map((q) => ({ id: q.id, title: q.short, options: breakdown(q, props.answers) })),
})).filter((s) => s.questions.length));
</script>

<template>
  <section class="score-card" :class="{ neg: top > 50 }" aria-live="polite">
    <p class="score-label">Tus puntos de suerte</p>
    <div class="score-total">{{ signed(score.total) }}</div>
    <p class="score-top">{{ headline }}</p>
    <div class="verdict">
      <b>{{ v.title }}</b>
      <p>{{ v.text }}</p>
    </div>

    <details class="score-details">
      <summary>Ver cómo puntuaba cada opción</summary>
      <h3 class="answers-section">País <span class="pts">{{ signed(score.country) }}</span></h3>
      <p class="opt chosen"><span>{{ place?.name ?? "—" }}</span><span>{{ signed(countryPoints(place)) }}</span></p>
      <template v-for="s in details" :key="s.id">
        <h3 class="answers-section">{{ s.title }} <span class="pts">{{ signed(s.points) }}</span></h3>
        <div v-for="q in s.questions" :key="q.id" class="q">
          <p class="q-title">{{ q.title }}</p>
          <p v-for="o in q.options" :key="o.label" class="opt" :class="{ chosen: o.chosen }">
            <span>{{ o.chosen ? "▸ " : "" }}{{ o.label }}</span><span>{{ signed(o.points) }}</span>
          </p>
        </div>
      </template>
    </details>

    <p class="score-note">
      Porcentaje estimado: tus puntos comparados con {{ SIMULATED.toLocaleString("es-ES") }} personas simuladas
      (país al azar según su población y el resto de respuestas al azar). No hay datos reales de cómo se reparten estos puntos en el mundo.
    </p>
  </section>
</template>
