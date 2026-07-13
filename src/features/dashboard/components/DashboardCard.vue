<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string
  delta?: string
  variant?: 'white' | 'blue'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'white'
})

const cardClasses = computed(() => {
  if (props.variant === 'blue') {
    return 'border-blue-200 bg-blue-50/75'
  }
  return 'border-slate-200 bg-white'
})

const labelClasses = computed(() => {
  return props.variant === 'blue' ? 'text-blue-600' : 'text-slate-400'
})

const valueClasses = computed(() => {
  return props.variant === 'blue' ? 'text-blue-700' : 'text-slate-900'
})
</script>

<template>
  <div
    class="relative flex w-full flex-col items-start rounded border bg-white p-6"
    :class="cardClasses"
  >
    <p class="text-[10px] font-bold uppercase tracking-[2px]" :class="labelClasses">
      {{ label }}
    </p>
    <p class="mt-4 text-4xl font-extrabold tracking-tight" :class="valueClasses">
      {{ value }}
    </p>

    <p v-if="delta" class="mt-2 text-xs font-semibold text-slate-500/80">
      {{ delta }}
    </p>

    <!-- Decorative Accent for Blue Variant -->
    <div
      v-if="variant === 'blue'"
      class="absolute right-0 top-0 h-1 w-full bg-blue-500"
    />
  </div>
</template>
