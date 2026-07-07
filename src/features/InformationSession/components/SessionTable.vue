<script setup lang="ts">
import type { Session } from '../types/session'

defineProps<{
  sessions: Session[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [session: Session]
  'view-candidates': [session: Session]
}>()

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
function getConversionRate(s: Session) {
  if (s.attendance === 0) return 0
  return Math.round((s.convertedCount / s.attendance) * 100)
}

function getProvinceColor(province: string) {
  const colors: Record<string, string> = {
    'Phnom Penh': 'bg-blue-400',
    'Battambang': 'bg-emerald-400',
    'Siem Reap': 'bg-purple-400',
    'Kampong Cham': 'bg-amber-400',
  }
  return colors[province] || 'bg-slate-300'
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
    <table class="w-full text-left text-sm border-collapse">
      <thead class="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase tracking-[0.1em]">
        <tr>
          <th class="pl-6 pr-4 py-3.5 font-bold">Date & ID</th>
          <th class="px-4 py-3.5 font-bold">School & Province</th>
          <th class="px-4 py-3.5 font-bold text-right">Attendance</th>
          <th class="px-4 py-3.5 font-bold text-right">Conversion</th>
          <th class="pl-4 pr-6 py-3.5 font-bold"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr 
          v-for="s in sessions" 
          :key="s.id"
          class="group hover:bg-slate-50/80 transition-all cursor-pointer"
          :class="{ 'bg-blue-50/40': s.id === selectedId }"
          @click="emit('select', s)">
          <td class="pl-6 pr-4 py-4.5">
            <p class="font-bold text-slate-900 leading-tight">{{ formatDate(s.date) }}</p>
            <p class="text-[10px] font-mono text-slate-400 mt-1 uppercase">#{{ s.id.slice(0, 8) }}</p>
          </td>
          <td class="px-4 py-4.5">
            <p class="font-semibold text-slate-700 leading-tight">{{ s.school }}</p>
            <p class="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full" :class="getProvinceColor(s.province)"></span>
              {{ s.province }}
            </p>
          </td>
          <td class="px-4 py-4.5 text-right">
            <span class="font-mono font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded text-[11px]">
              {{ s.attendance.toLocaleString() }}
            </span>
          </td>
          <td class="px-4 py-4.5 text-right">
            <div class="inline-flex flex-col items-end">
              <span class="font-mono text-blue-600 font-extrabold text-xs">{{ getConversionRate(s) }}%</span>
              <div class="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  :style="{ width: `${getConversionRate(s)}%` }"/>
              </div>
            </div>
          </td>
          <td class="pl-4 pr-6 py-4.5 text-right">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
              @click.stop="emit('view-candidates', s)">
              Candidates
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Empty State -->
    <div v-if="sessions.length === 0" class="py-20 flex flex-col items-center justify-center text-slate-400">
      <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-sm font-semibold text-slate-500">No sessions available</p>
      <p class="text-xs text-slate-400 mt-1">Try adjusting your filters or add a new session.</p>
    </div>
  </div>
</template>
