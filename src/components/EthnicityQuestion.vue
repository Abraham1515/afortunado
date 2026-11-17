<script setup>
import { computed } from "vue";
import { ETHNIC_GROUPS, MIXABLE, groupById } from "../data/ethnicities.js";

// Respuesta: { group, sub, mix: [], other: "" }
const props = defineProps({ modelValue: { type: Object, default: null } });
const emit = defineEmits(["update:modelValue"]);

const value = computed(() => props.modelValue ?? { group: null, sub: null, mix: [], other: "" });
const group = computed(() => (value.value.group ? groupById[value.value.group] : null));

const update = (patch) => emit("update:modelValue", { ...value.value, ...patch });
const setGroup = (id) => { if (id !== value.value.group) update({ group: id, sub: null, mix: [], other: "" }); };
const setSub = (id) => update({ sub: id });
const toggleMix = (id) => update({
  mix: value.value.mix.includes(id) ? value.value.mix.filter((m) => m !== id) : [...value.value.mix, id],
});
</script>

<template>
  <div class="ethnicity">
    <fieldset class="groups">
      <legend class="sr-only">Grupo</legend>
      <label v-for="g in ETHNIC_GROUPS" :key="g.id" class="option" :class="{ chosen: value.group === g.id}">
        <input type="radio" name="eth-group" :value="g.id" :checked="value.group === g.id" @change="setGroup(g.id)" />
        <span>{{ g.name }}</span>
      </label>
    </fieldset>

    <div v-if="group" class="detail">
      <p v-if="group.description" class="desc">{{ group.description }}</p>

      <fieldset v-if="group.subgroups.length" class="subgroups">
        <legend>¿Más concretamente? <span class="muted">(elige uno)</span></legend>
        <label v-for="s in group.subgroups" :key="s.id" class="sub" :class="{ chosen: value.sub === s.id }">
          <input type="radio" name="eth-sub" :value="s.id" :checked="value.sub === s.id" @click="setSub(s.id)" />
          <span>
            <b>{{ s.name }}</b>
            <small>{{ s.examples }}</small>
          </span>
        </label>
      </fieldset>

      <fieldset v-if="group.id === 'mixto'" class="subgroups">
        <legend>¿Qué grupos se combinan? <span class="muted">(marca al menos dos)</span></legend>
        <label v-for="g in MIXABLE" :key="g.id" class="sub" :class="{ chosen: value.mix.includes(g.id) }">
          <input type="checkbox" :checked="value.mix.includes(g.id)" @change="toggleMix(g.id)" />
          <span><b>{{ g.name }}</b></span>
        </label>
      </fieldset>

      <label v-if="group.id === 'otro'" class="other">
        <span>¿Cuál? <span class="muted">(opcional)</span></span>
        <input type="text" maxlength="80" :value="value.other" placeholder="Escríbelo aquí" @input="update({ other: $event.target.value })" />
      </label>
    </div>
  </div>
</template>
