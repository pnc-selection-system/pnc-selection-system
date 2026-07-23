<script setup lang="ts">
import type { AssignedVisit, VisitStatus } from '../types/visit'

defineProps<{
  visits: AssignedVisit[]
  selectedCandidateId?: string | null
}>()

const emit = defineEmits<{
  select: [visit: AssignedVisit]
}>()

const statusClasses: Record<VisitStatus, string> = {
  Assigned: 'bg-amber-50 text-amber-700 border-amber-200',
  'In progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Submitted: 'bg-green-50 text-green-700 border-green-200',
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white">
    <div class="border-b border-slate-100 px-4 py-3">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        My assigned visits
      </p>
    </div>

    <div class="divide-y divide-slate-50">
      <button
        v-for="visit in visits"
        :key="visit.id"
        type="button"
        class="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-slate-50 transition-colors rounded"
        :class="{ 'bg-blue-50/50': visit.candidateId === selectedCandidateId }"
        @click="emit('select', visit)"
      >
        <span>
          <span class="block text-sm font-semibold text-slate-800">{{ visit.candidateName }}</span>
          <span class="text-sm text-blue-600">{{ visit.province }}</span>
        </span>
        <span class="shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium" :class="statusClasses[visit.status]">
          {{ visit.status }}
        </span>
      </button>
    </div>
  </div>
</template>