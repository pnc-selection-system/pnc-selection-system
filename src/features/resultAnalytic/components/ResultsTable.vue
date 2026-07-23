<script setup lang="ts">
import { computed } from 'vue'
import type { CandidateResultRow } from '../types/candidate'

const props = defineProps<{
  rows: CandidateResultRow[]
}>()

/** Extract dynamic subject keys from the first row of data */
const subjectKeys = computed<string[]>(() => {
  if (props.rows.length === 0) return []
  return Object.keys(props.rows[0].scores)
})
</script>

<template>
  <div class="overflow-hidden rounded border border-slate-200 bg-white">
    <div v-if="rows.length === 0" class="px-5 py-12 text-center text-sm text-slate-400">
      <svg class="mx-auto mb-3 h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p>No results yet. Import exam data to see results here.</p>
    </div>

    <table v-else class="w-full text-sm">
      <thead v-once>
        <tr class="border-b border-slate-100 bg-slate-50">
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Rank</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Student ID</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate</th>
          <th
            v-for="subject in subjectKeys"
            :key="subject"
            class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400"
          >
            {{ subject }}
          </th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Total %</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Result</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.rank" class="border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors">
          <td class="px-5 py-3 text-slate-500">#{{ row.rank }}</td>
          <td class="px-5 py-3 font-mono text-xs text-slate-600">{{ row.student_id || '-' }}</td>
          <td class="px-5 py-3 text-slate-800 hover:text-blue-600 cursor-pointer">
            {{ row.candidate }}
          </td>
          <td
            v-for="subject in subjectKeys"
            :key="subject"
            class="px-5 py-3 text-slate-700"
          >
            {{ row.scores[subject] !== null && row.scores[subject] !== undefined ? (row.scores[subject] as number).toFixed(1) : '-' }}
          </td>
          <td class="px-5 py-3 font-medium text-slate-800">{{ row.total.toFixed(1) }}%</td>
          <td class="px-5 py-3">
            <span
              class="inline-block rounded px-2 py-0.5 text-xs font-medium"
              :class="row.result === 'Pass' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'"
            >
              {{ row.result }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
