<script setup lang="ts">
import { computed } from 'vue'
import type { Outcome, Tally } from '../types/vote'

const props = defineProps<{
  tally: Tally
  outcome: Outcome
  isLocked: boolean
}>()

defineEmits<{
  lockRound: []
  viewFinalList: []
}>()

const outcomeClasses = computed(() => {
  if (props.outcome === 'Selected') return 'bg-green-50 text-green-700 border-green-200'
  if (props.outcome === 'Not selected') return 'bg-rose-50 text-rose-700 border-rose-200'
  return 'bg-slate-100 text-slate-500 border-slate-200'
})
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-5">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Tally
    </p>

    <div class="mt-4 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-sm text-slate-600">Approve</span>
        <span class="text-sm font-semibold text-green-700">{{ tally.approve }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-slate-600">Reject</span>
        <span class="text-sm font-semibold text-rose-700">{{ tally.reject }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-slate-600">Abstain</span>
        <span class="text-sm font-semibold text-slate-500">{{ tally.abstain }}</span>
      </div>
    </div>

    <div class="mt-4 border-t border-slate-100 pt-4">
      <span class="block rounded border px-3 py-1.5 text-center text-xs font-medium" :class="outcomeClasses">
        Outcome: {{ outcome }}
      </span>
    </div>

    <button
      type="button"
      class="mt-3 flex w-full items-center justify-center gap-1.5 rounded px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed"
      :class="
        isLocked
          ? 'cursor-default border border-slate-200 bg-slate-50 text-slate-400'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      "
      :disabled="isLocked"
      @click="$emit('lockRound')"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
        <rect x="4.5" y="9" width="11" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
        <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      {{ isLocked ? 'Round locked' : 'Lock round' }}
    </button>

    <button
      type="button"
      class="mt-2 flex w-full items-center justify-center gap-1 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      @click="$emit('viewFinalList')"
    >
      Final list & waitlist ›
    </button>
  </div>
</template>