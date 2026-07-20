<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CandidateResult } from '../types/response'

const props = defineProps<{ results: CandidateResult[] }>()

const expanded = ref<number | null>(null)
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.results
  return props.results.filter(
    (r) =>
      r.candidate_name.toLowerCase().includes(q) ||
      r.candidate_code.toLowerCase().includes(q) ||
      (r.province ?? '').toLowerCase().includes(q),
  )
})

function toggle(id: number) {
  expanded.value = expanded.value === id ? null : id
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div>
        <p class="text-sm font-semibold text-slate-800">Assessment Results</p>
        <p class="mt-0.5 text-xs text-slate-400">{{ results.length }} response{{ results.length !== 1 ? 's' : '' }} submitted</p>
      </div>
      <input
        v-model="search"
        type="text"
        placeholder="Search candidate..."
        class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <!-- Empty -->
    <div v-if="filtered.length === 0" class="py-16 text-center text-sm text-slate-400">
      No results found
    </div>

    <!-- Table -->
    <div v-else class="divide-y divide-slate-100">
      <div v-for="result in filtered" :key="result.candidate_id">
        <!-- Row -->
        <button
          type="button"
          class="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
          @click="toggle(result.candidate_id)"
        >
          <!-- Avatar -->
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {{ result.candidate_name.charAt(0) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800">
              {{ result.candidate_name }}
              <span class="ml-1.5 font-mono text-xs text-slate-400">{{ result.candidate_code }}</span>
            </p>
            <p class="mt-0.5 text-xs text-slate-400">
              {{ result.province ?? '—' }}
              <span v-if="result.status"> · {{ result.status }}</span>
            </p>
          </div>

          <!-- Score -->
          <div class="text-right shrink-0">
            <p class="text-lg font-bold" :class="result.passed ? 'text-emerald-600' : 'text-rose-500'">
              {{ result.total_score }}%
            </p>
            <span
              class="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              :class="result.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'"
            >
              {{ result.passed ? 'Passed' : 'Failed' }}
            </span>
          </div>

          <!-- Threshold -->
          <div class="hidden shrink-0 text-right sm:block">
            <p class="text-xs text-slate-400">Threshold</p>
            <p class="text-sm font-medium text-slate-600">{{ result.pass_threshold }}%</p>
          </div>

          <!-- Chevron -->
          <svg
            class="h-4 w-4 shrink-0 text-slate-400 transition"
            :class="expanded === result.candidate_id ? 'rotate-180' : ''"
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Score bar -->
        <div class="px-5 pb-1">
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="result.passed ? 'bg-emerald-400' : 'bg-rose-400'"
              :style="{ width: `${Math.min(result.total_score, 100)}%` }"
            />
          </div>
        </div>

        <!-- Expanded answers -->
        <div v-if="expanded === result.candidate_id" class="border-t border-slate-100 bg-slate-50 px-5 py-4">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Answers</p>
          <div class="space-y-3">
            <div
              v-for="(ans, i) in result.answers"
              :key="ans.question_id"
              class="rounded-lg border border-slate-200 bg-white px-4 py-3"
            >
              <p class="text-xs font-medium text-slate-500">Q{{ i + 1 }} · {{ ans.label }}</p>
              <p class="mt-1 text-sm text-slate-800">
                {{ ans.answer ?? '—' }}
              </p>
            </div>
          </div>
          <p class="mt-3 text-right text-xs text-slate-400">
            Submitted {{ result.submitted_at }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
