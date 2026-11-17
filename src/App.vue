<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
import WorldMap from "./components/WorldMap.vue";
import CountryPicker from "./components/CountryPicker.vue";
import ResultPanel from "./components/ResultPanel.vue";
import ScoreCard from "./components/ScoreCard.vue";
import EthnicityQuestion from "./components/EthnicityQuestion.vue";
import YesNoQuestion from "./components/YesNoQuestion.vue";
import ChoiceQuestion from "./components/ChoiceQuestion.vue";
import { places, randomBirth } from "./lib/luck.js";
import { QUESTIONS, SECTIONS, sectionById } from "./questions.js";

const answers = reactive(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
// Preguntas que tocan según las respuestas (algunas dependen de otras, p. ej. las de hijos).
const active = computed(() => QUESTIONS.filter((q) => !q.showIf || q.showIf(answers)));
const step = ref(0); // índice dentro de `active`; active.length = resultado
const fromLottery = ref(false);
const mapRef = ref(null);
const panelEl = ref(null);

const showResult = computed(() => step.value >= active.value.length);
const q = computed(() => active.value[step.value]);
const section = computed(() => (q.value ? sectionById[q.value.section] : null));
const sectionNumber = computed(() => SECTIONS.indexOf(section.value) + 1);
const chosen = computed(() => (answers.birthplace ? places[answers.birthplace] : null));
const isAnswered = (question) => question.answered(answers[question.id]);
const canContinue = computed(() => !showResult.value && isAnswered(q.value));
// Padres de orígenes distintos → mestizo.
const mestizo = computed(() => answers.parentsSame === false);
// Resumen agrupado por secciones (solo preguntas que tocan y están respondidas).
const summary = computed(() => SECTIONS.map((s) => ({
  ...s,
  rows: active.value.filter((question) => question.section === s.id && isAnswered(question)).map((question) => ({
    id: question.id, label: question.short, text: question.summary(answers[question.id]),
  })),
})).filter((s) => s.rows.length));

function chooseBirthplace(id, { focus = false } = {}) {
  answers.birthplace = id;
  fromLottery.value = false;
  if (focus) mapRef.value?.focus(id);
}
const next = () => { if (canContinue.value) step.value++; };
const back = () => { if (step.value > 0) step.value--; };

function lottery() {
  const p = randomBirth();
  answers.birthplace = p.id;
  fromLottery.value = true;
  step.value = active.value.length;
  mapRef.value?.focus(p.id);
}

// En móvil el panel queda debajo del mapa: al cambiar de pregunta, se lleva a la vista.
watch(step, async () => {
  await nextTick();
  if (window.matchMedia("(max-width: 900px)").matches) panelEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
});
</script>

<template>
  <div class="radar-bg" aria-hidden="true"><div class="sweep"></div></div>
  <div class="scanlines" aria-hidden="true"></div>

  <header class="top">
    <h1>¿Cómo de afortunado eres?</h1>
    <p class="lead">Nadie elige dónde nace. Responde y descubre cuánta suerte tuviste al nacer. Tal vez crees que eres un cenizo y en realidad naciste en una cuna de oro y no lo sabes.</p>
  </header>

  <main class="layout">
    <WorldMap
      ref="mapRef"
      :selected-id="answers.birthplace"
      :reveal="showResult"
      :interactive="step === 0 || showResult"
      @select="chooseBirthplace"
    />

    <aside ref="panelEl" class="panel">
      <template v-if="!showResult">
        <p class="step">
          <span>{{ sectionNumber }} · {{ section.title.toUpperCase() }}</span>
          <span>{{ step + 1 }} / {{ active.length }}</span>
        </p>
        <div class="progress" role="progressbar" :aria-valuenow="step + 1" aria-valuemin="1" :aria-valuemax="active.length">
          <div :style="{ width: ((step + 1) / active.length) * 100 + '%' }"></div>
        </div>
        <p v-if="section.desc" class="section-desc">{{ section.desc }}</p>
        <h2 class="question">{{ q.title }}</h2>
        <p v-if="q.hint" class="hint">{{ q.hint }}</p>

        <CountryPicker
          v-if="q.type === 'country'"
          :model-value="answers.birthplace"
          @update:model-value="(id) => chooseBirthplace(id, { focus: true })"
          @confirm="next"
        />
        <EthnicityQuestion v-else-if="q.type === 'ethnicity'" v-model="answers[q.id]" />
        <YesNoQuestion v-else-if="q.type === 'yesno'" :key="q.id" v-model="answers[q.id]" :name="q.id" />
        <ChoiceQuestion v-else-if="q.type === 'choice'" :key="q.id" v-model="answers[q.id]" :name="q.id" :options="q.options" />

        <p class="selection">
          <template v-if="q.id === 'parentsSame' && mestizo">Tus padres tienen orígenes distintos: <b>eres mestizo</b>.</template>
          <template v-else-if="isAnswered(q)">Has elegido: <b>{{ q.summary(answers[q.id]) }}</b></template>
          <span v-else class="muted">Aún no has respondido.</span>
        </p>
        <div class="actions">
          <button v-if="step > 0" type="button" class="ghost" @click="back">← Atrás</button>
          <button type="button" class="primary" :disabled="!canContinue" @click="next">
            {{ step === active.length - 1 ? "Ver mi resultado →" : "Siguiente →" }}
          </button>
        </div>
      </template>

      <template v-else>
        <ScoreCard v-if="!fromLottery" :answers="answers" :place="chosen" :questions="active" />
        <ResultPanel :place="chosen" :from-lottery="fromLottery" />
        <details v-if="!fromLottery" class="answers-box">
          <summary>Tus respuestas</summary>
          <template v-for="s in summary" :key="s.id">
            <h3 class="answers-section">{{ s.title }}</h3>
            <dl class="answers">
              <template v-for="row in s.rows" :key="row.id">
                <dt>{{ row.label }}</dt><dd>{{ row.text }}</dd>
              </template>
              <template v-if="s.id === 'origen' && mestizo"><dt>Mestizo</dt><dd><b>Sí</b></dd></template>
            </dl>
          </template>
        </details>
        <div class="actions">
          <button type="button" class="ghost" @click="step = 0">← Cambiar respuestas</button>
          <button type="button" class="primary" @click="lottery">🎲 Nacer al azar</button>
        </div>
      </template>
    </aside>
  </main>

  <footer>
    Fuentes: PNUD, Informe sobre Desarrollo Humano 2023/2024 (IDH y esperanza de vida, datos de 2022) · ONU, población 2023.
    El IDH resume salud, educación e ingresos. Es una media nacional: la suerte de cada persona depende también de mucho más.
  </footer>
</template>
