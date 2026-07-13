<script setup lang="ts">
import type { Session } from '../types/session'

const props = defineProps<{
  sessions: Session[]
  selectedId?: string | null
}>()

const emit = defineEmits<{
  select: [session: Session]
}>()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50">
          <th class="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Date</th>
          <th class="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Province/School</th>
          <th class="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">PNC/NGO</th>
          <th class="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Attendance</th>
          <th class="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate</th>
          <th class="px-4 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Partner/Officer</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="session in sessions"
          :key="session.id"
          class="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50"
          :class="{ 'bg-blue-50/50': session.id === selectedId }"
          @click="emit('select', session)"
        >
          <td class="px-4 py-3 text-slate-600">{{ formatDate(session.date) }}</td>
          <td class="px-4 py-3">
            <span class="block font-medium text-slate-800">{{ session.province }}</span>
            <span class="block text-xs italic text-slate-400">{{ session.school }}</span>
          </td>
          <td class="px-4 py-3 text-slate-700">{{ session.pncOrNgo }}</td>
          <td class="px-4 py-3 text-slate-700">{{ session.attendance }}</td>
          <td class="px-4 py-3">
            <span
              v-if="session.candidateCount > 0"
              class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
            >
              {{ session.candidateCount }}
            </span>
            <span v-else class="text-slate-300">—</span>
          </td>
          <td class="px-4 py-3 text-slate-500">
            {{ session.partnerOrOfficer || '—' }}
          </td>
        </tr>
        <tr v-if="sessions.length === 0">
          <td colspan="6" class="px-4 py-10 text-center text-sm text-slate-400">
            No sessions match the current filters.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>