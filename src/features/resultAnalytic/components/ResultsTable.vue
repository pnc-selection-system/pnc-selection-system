<script setup lang="ts">
import type { CandidateResultRow } from '../types/candidate'
import { SUBJECT_WEIGHTS } from '../types/candidate'

defineProps<{
  rows: CandidateResultRow[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50">
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Rank</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Math {{ SUBJECT_WEIGHTS.math }}
          </th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Khmer {{ SUBJECT_WEIGHTS.khmer }}
          </th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Eng {{ SUBJECT_WEIGHTS.eng }}
          </th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Logic {{ SUBJECT_WEIGHTS.logic }}
          </th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Total</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Result</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.rank" class="border-b border-slate-50 last:border-0 hover:bg-slate-50">
          <td class="px-5 py-3 text-slate-500">#{{ row.rank }}</td>
          <td class="px-5 py-3" :class="row.rank <= 2 ? 'font-semibold text-slate-800' : 'text-blue-600'">
            {{ row.candidate }}
          </td>
          <td class="px-5 py-3 text-slate-700">{{ row.scores.math }}</td>
          <td class="px-5 py-3 text-slate-700">{{ row.scores.khmer }}</td>
          <td class="px-5 py-3 text-slate-700">{{ row.scores.eng }}</td>
          <td class="px-5 py-3 text-slate-700">{{ row.scores.logic }}</td>
          <td class="px-5 py-3 font-semibold text-slate-800">{{ row.total.toFixed(1) }}</td>
          <td class="px-5 py-3">
            <span
              class="rounded px-2 py-0.5 text-xs font-medium"
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