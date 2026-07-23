<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { CommitSummary } from '../types/mapping'

defineProps<{
  summary: CommitSummary | null
}>()

const emit = defineEmits<{
  done: []
}>()
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-6">
    <div v-if="!summary" class="py-10 text-center text-sm text-slate-400">
      <div class="flex items-center justify-center gap-2">
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        Committing import and calculating scores…
      </div>
    </div>

    <div v-else>
      <!-- Success banner -->
      <div class="rounded-lg border border-green-200 bg-green-50 px-6 py-6 text-center">
        <div class="mb-2 inline-flex items-center justify-center rounded-full bg-green-100 p-2">
          <svg class="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>
        <p class="text-lg font-semibold text-green-700">
          ✓ {{ summary.imported.toLocaleString() }} results imported & scored
        </p>
        <p v-if="summary.skipped > 0" class="mt-1 text-sm text-amber-600">
          {{ summary.skipped }} row(s) skipped due to errors
        </p>
      </div>

      <!-- Results details -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <div class="rounded border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs text-slate-400">Imported</p>
          <p class="text-xl font-semibold text-green-600">{{ summary.imported.toLocaleString() }}</p>
        </div>
        <div class="rounded border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs text-slate-400">Skipped</p>
          <p class="text-xl font-semibold" :class="summary.skipped > 0 ? 'text-amber-600' : 'text-slate-600'">
            {{ summary.skipped.toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- Info -->
      <div class="mt-4 rounded-md border border-blue-100 bg-blue-50 px-4 py-3">
        <div class="flex items-start gap-2">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-blue-500" viewBox="0 0 24 24" fill="none">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <div>
            <p class="text-sm text-blue-800">
              Scores have been calculated using subject rules and stored in the system.
            </p>
            <p class="mt-1 text-xs text-blue-600">
              Results are in <span class="font-medium">draft</span> status — review on the Results & Analytics screen
              before publishing.
            </p>
          </div>
        </div>
      </div>

      <!-- Errors (if any) -->
      <div v-if="summary.errors && summary.errors.length > 0" class="mt-4">
        <details class="rounded-md border border-red-100 bg-red-50">
          <summary class="cursor-pointer px-4 py-2.5 text-sm font-medium text-red-700">
            {{ summary.errors.length }} error(s) — click to show details
          </summary>
          <div class="border-t border-red-100 px-4 py-2.5">
            <ul class="list-inside list-disc space-y-1 text-sm text-red-600">
              <li v-for="(err, i) in summary.errors.slice(0, 20)" :key="i">{{ err }}</li>
              <li v-if="summary.errors.length > 20" class="text-xs text-red-400">
                …and {{ summary.errors.length - 20 }} more
              </li>
            </ul>
          </div>
        </details>
      </div>

      <div class="mt-6 text-center">
        <BaseButton @click="emit('done')">
          Go to Results & Analytics ›
        </BaseButton>
      </div>
    </div>
  </div>
</template>
