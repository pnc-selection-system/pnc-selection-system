<script setup lang="ts">
import { computed } from 'vue'
import { WIZARD_STEPS, type WizardStepKey } from '../types/wizard'

const props = defineProps<{
  current: WizardStepKey
}>()

const emit = defineEmits<{
  select: [key: WizardStepKey]
}>()

const currentOrder = computed(() => WIZARD_STEPS.find((s) => s.key === props.current)?.order ?? 1)

function stateOf(order: number): 'done' | 'active' | 'upcoming' {
  if (order < currentOrder.value) return 'done'
  if (order === currentOrder.value) return 'active'
  return 'upcoming'
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <button
      v-for="step in WIZARD_STEPS"
      :key="step.key"
      type="button"
      class="flex items-center gap-2 rounded border px-4 py-2.5 text-sm font-medium transition"
      :class="
        stateOf(step.order) === 'active'
          ? 'border-blue-300 bg-blue-50 text-slate-800'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      "
      @click="emit('select', step.key)"
    >
      <span
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        :class="{
          'bg-green-600 text-white': stateOf(step.order) === 'done',
          'bg-blue-600 text-white': stateOf(step.order) === 'active',
          'border border-slate-300 text-slate-400': stateOf(step.order) === 'upcoming',
        }"
      >
        {{ step.order }}
      </span>
      {{ step.label }}
    </button>
  </div>
</template>