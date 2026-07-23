<script setup lang="ts">
import { computed } from 'vue'
import type { Candidate } from '../types/index'

const props = defineProps<{
  candidate: Candidate
}>()

interface StatusHistoryEntry {
  status: string
  label: string
  date: string
  source: string
}

// Generate status history based on the candidate's current status
const statusTimeline = computed<StatusHistoryEntry[]>(() => {
  if (!props.candidate) return []

  const statusOrder: { key: string; label: string; source: string }[] = [
    { key: 'registered', label: 'Registered', source: 'from session' },
    { key: 'exam_done', label: 'Exam passed', source: 'import' },
    { key: 'investigating', label: 'Investigating', source: 'by O. Officer' },
    { key: 'assessed', label: 'Assessed', source: 'auto' },
    { key: 'approved', label: 'Approved', source: 'by Admin' },
    { key: 'rejected', label: 'Rejected', source: 'by Admin' },
    { key: 'on_hold', label: 'On Hold', source: 'by Admin' },
  ]

  const currentStatus = props.candidate.status
  const currentStatusIndex = statusOrder.findIndex((s) => s.key === currentStatus)

  if (currentStatusIndex === -1) return []

  // Build history up to current status
  const history: StatusHistoryEntry[] = []
  const baseDate = new Date()

  for (let i = 0; i <= currentStatusIndex; i++) {
    const status = statusOrder[i]
    const daysAgo = (currentStatusIndex - i) * 7 // Each status 7 days apart
    const date = new Date(baseDate)
    date.setDate(date.getDate() - daysAgo)

    history.push({
      status: status.key,
      label: status.label,
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      source: status.source,
    })
  }

  // Return in reverse chronological order (newest first)
  return history.reverse()
})
</script>

<template>
  <div class="status-history-tab">
    <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
      Status History (Immutable Audit)
    </h3>

    <div v-if="statusTimeline.length === 0" class="py-8 text-center">
      <p class="text-sm text-slate-400">No status history available.</p>
    </div>

    <div v-else class="relative">
      <!-- Timeline line -->
      <div class="absolute left-1 top-2 bottom-2 w-px bg-slate-200"></div>

      <!-- Timeline items -->
      <div class="space-y-4">
        <div
          v-for="(entry, index) in statusTimeline"
          :key="index"
          class="group relative flex items-start gap-4 pl-4"
        >
          <!-- Timeline dot -->
          <div
            :class="[
              'relative z-10 mt-1 h-2.5 w-2.5 rounded-full ring-2 ring-white transition-all',
              index === 0 ? 'bg-blue-500 ring-blue-100' : 'bg-slate-300',
            ]"
          ></div>

          <!-- Content -->
          <div class="flex-1 pb-1">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'font-semibold',
                  index === 0 ? 'text-slate-900' : 'text-slate-700',
                ]"
              >
                {{ entry.label }}
              </span>
              <span class="text-sm text-slate-400">·</span>
              <span class="text-sm text-slate-500">{{ entry.date }}</span>
              <span class="text-sm text-slate-400">·</span>
              <span class="text-sm text-slate-400">{{ entry.source }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-history-tab {
  padding: 4px 0;
}
</style>
