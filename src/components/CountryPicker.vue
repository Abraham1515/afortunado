<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { placeList, fold } from "../lib/luck.js";

const props = defineProps({ modelValue: { type: String, default: null } });
const emit = defineEmits(["update:modelValue", "confirm"]);

const KIND_LABEL = { proxy: "territorio", nodata: "sin datos", uninhabited: "deshabitado" };

const query = ref("");
const active = ref(-1);
const listEl = ref(null);

const results = computed(() => {
  const q = fold(query.value.trim());
  return q ? placeList.filter((p) => fold(p.name).includes(q)) : placeList;
});
watch(query, () => { active.value = results.value.length ? 0 : -1; });

function scrollTo(selector) {
  nextTick(() => listEl.value?.querySelector(selector)?.scrollIntoView({ block: "nearest" }));
}
// Si el país se elige en el mapa, la lista lo muestra.
watch(() => props.modelValue, (id) => { if (id) scrollTo(`[data-id="${id}"]`); });

function choose(p) { emit("update:modelValue", p.id); }

function onKey(e) {
  const n = results.value.length;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!n) return;
    active.value = e.key === "ArrowDown" ? Math.min(n - 1, active.value + 1) : Math.max(0, active.value - 1);
    scrollTo('[data-active="true"]');
  } else if (e.key === "Enter") {
    e.preventDefault();
    const p = results.value[active.value];
    if (p && p.id !== props.modelValue) choose(p);
    else if (props.modelValue) emit("confirm");
  }
}
</script>

<template>
  <div class="picker">
    <label for="country-search" class="sr-only">Busca tu país</label>
    <input
      id="country-search"
      v-model="query"
      type="search"
      role="combobox"
      aria-expanded="true"
      aria-controls="country-list"
      aria-autocomplete="list"
      :aria-activedescendant="results[active] ? 'opt-' + results[active].id : undefined"
      placeholder="Escribe para buscar…"
      autocomplete="off"
      spellcheck="false"
      @keydown="onKey"
    />
    <ul id="country-list" ref="listEl" role="listbox" aria-label="Países y territorios">
      <li
        v-for="(p, i) in results"
        :id="'opt-' + p.id"
        :key="p.id"
        role="option"
        :aria-selected="p.id === modelValue"
        :data-id="p.id"
        :data-active="i === active"
        :class="{ active: i === active, chosen: p.id === modelValue }"
        @click="choose(p)"
        @dblclick="choose(p); emit('confirm')"
        @mousemove="active = i"
      >
        <span>{{ p.name }}</span>
        <small v-if="KIND_LABEL[p.kind]">{{ KIND_LABEL[p.kind] }}</small>
      </li>
      <li v-if="!results.length" class="none">Nada coincide con «{{ query }}»</li>
    </ul>
    <p class="count">{{ results.length }} de {{ placeList.length }} países y territorios</p>
  </div>
</template>
