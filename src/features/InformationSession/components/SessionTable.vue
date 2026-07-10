<script setup lang="ts">
import BaseBadge from '@/components/base/BaseBadge.vue'
import { formatDateShort } from '@/utils/date'
import type { Session } from '../types/session'

defineProps<{
  sessions: Session[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [session: Session]
  'view-candidates': [session: Session]
}>()
</script>

<template>
  <div class="overflow-hidden rounded border border-slate-200 bg-white">
    <table class="min-w-full text-left text-sm">
      <thead>
        <tr class="border-b border-slate-200 bg-slate-50">
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Date</th>
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Province / School</th>
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Attendance</th>
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Candidates</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr
          v-for="s in sessions"
          :key="s.id"
          class="group hover:bg-blue-50/40 transition-all cursor-pointer"
          :class="{ 'bg-blue-50/40': s.id === selectedId }"
          @click="emit('select', s)">
          <td class="px-4 py-2 text-xs text-slate-700">{{ formatDateShort(s.date) }}</td>
          <td class="px-4 py-2 text-xs text-slate-700">
            {{ s.province }} · {{ s.school }}
          </td>
          <td class="px-4 py-2 text-xs text-slate-700">{{ s.attendance.toLocaleString() }}</td>
          <td class="px-4 py-2">
            <BaseBadge type="primary" size="small">
              {{ s.convertedCount }} converted
            </BaseBadge>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
