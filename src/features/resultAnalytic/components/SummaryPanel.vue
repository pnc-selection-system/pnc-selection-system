<script setup lang="ts">
import type { SummaryStats } from '../types/results'

defineProps<{
  summary: SummaryStats
}>()
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-5">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Summary
    </p>

    <dl class="mt-4 space-y-4">
      <div class="flex items-center justify-between">
        <dt class="text-sm text-slate-600">Sat exam</dt>
        <dd class="text-sm font-semibold text-slate-800">{{ summary.satExam.toLocaleString() }}</dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-sm text-slate-600">Passed</dt>
        <dd class="text-sm font-semibold text-green-600">{{ summary.passed.toLocaleString() }}</dd>
      </div>
      <div class="flex items-center justify-between">
        <dt class="text-sm text-slate-600">Failed</dt>
        <dd class="text-sm font-semibold text-rose-600">{{ summary.failed.toLocaleString() }}</dd>
      </div>
      <div class="flex items-center justify-between border-t border-slate-100 pt-4">
        <dt class="text-sm text-slate-600">Pass rate</dt>
        <dd class="text-sm font-semibold text-slate-800">{{ summary.passRate }}%</dd>
      </div>
    </dl>
  </div>
</template>