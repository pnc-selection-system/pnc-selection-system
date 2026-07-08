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
    return 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:shadow-md active:scale-[0.98]'
  }
  return 'border-slate-200 bg-white hover:shadow-md active:scale-[0.98]'
})

const labelClasses = computed(() => {
  return props.variant === 'blue' ? 'text-blue-600' : 'text-slate-400'
})

const valueClasses = computed(() => {
  return props.variant === 'blue' ? 'text-blue-700' : 'text-slate-900'
})

const iconClasses = computed(() => {
  return props.variant === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
})
</script>

<template>
  <button
    type="button"
    class="group relative flex w-full flex-col items-start overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    :class="cardClasses"
    :aria-label="`${label}: ${value}`"
  >
    <p class="font-mono text-[10px] font-bold uppercase tracking-[2px]" :class="labelClasses">
      {{ label }}
    </p>
    <p class="mt-4 text-4xl font-extrabold tracking-tight" :class="valueClasses">
      {{ value }}
    </p>
    
    <div class="mt-2 flex w-full items-center justify-between">
      <p v-if="delta" class="text-xs font-semibold text-slate-500/80">
        {{ delta }}
      </p>
      
      <!-- Button Indicator Icon -->
      <div 
        class="rounded-full p-1.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
        :class="iconClasses"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Decorative Accent for Blue Variant -->
    <div 
      v-if="variant === 'blue'"
      class="absolute right-0 top-0 h-1 w-full bg-blue-500"
    />
  </button>
</template>
