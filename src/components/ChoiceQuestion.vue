<script setup>
// Pregunta de opciones cerradas. options: [{ v, t, d? }]
defineProps({
  modelValue: { type: String, default: null },
  options: { type: Array, required: true },
  name: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <fieldset class="choices">
    <legend class="sr-only">Respuesta</legend>
    <label v-for="o in options" :key="o.v" class="sub" :class="{ chosen: modelValue === o.v }">
      <input type="radio" :name="name" :checked="modelValue === o.v" @change="emit('update:modelValue', o.v)" />
      <span>
        <b>{{ o.t }}</b>
        <small v-if="o.d">{{ o.d }}</small>
      </span>
    </label>
  </fieldset>
</template>
