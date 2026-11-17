<script setup>
// Respuesta Sí / No: true, false o null (sin responder).
defineProps({
  modelValue: { type: Boolean, default: null },
  name: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <fieldset class="yesno">
    <legend class="sr-only">Respuesta</legend>
    <label v-for="opt in [{ v: true, t: 'Sí' }, { v: false, t: 'No' }]" :key="opt.t" class="option" :class="{ chosen: modelValue === opt.v }">
      <input type="radio" :name="name" :checked="modelValue === opt.v" @change="emit('update:modelValue', opt.v)" />
      <span>{{ opt.t }}</span>
    </label>
  </fieldset>
</template>
