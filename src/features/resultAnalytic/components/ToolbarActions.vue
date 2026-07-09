<script setup lang="ts">
import { computed } from 'vue'
import type { ExamRound, PublishStatus } from '../types/results'

const props = defineProps<{
  rounds: ExamRound[]
  modelValue: string
  status: PublishStatus
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  export: []
  publishLock: []
}>()

const statusLabel = computed(() => (props.status === 'draft' ? 'Draft — not published' : 'Published & locked'))
const statusClasses = computed(() =>
  props.status === 'draft'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-green-50 text-green-700 border-green-200',
)
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue"
          @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="round in rounds" :key="round.id" :value="round.id">{{ round.label }}</option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <span class="rounded-full border px-3 py-1.5 text-xs font-medium" :class="statusClasses">
        {{ statusLabel }}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        @click="emit('export')"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v10m0 0-3.5-3.5M10 13l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 15.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Export
      </button>

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="status === 'published'"
        @click="emit('publishLock')"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
          <rect x="4.5" y="9" width="11" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        {{ status === 'published' ? 'Published & locked' : 'Publish & lock results' }}
      </button>
    </div>
  </div>
</template>