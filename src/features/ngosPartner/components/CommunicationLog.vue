<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import EmptyState from '../../../components/ui/EmptyState.vue'
import type { CommunicationLogEntry } from '../types/communication'

defineProps<{
  entries: CommunicationLogEntry[]
}>()

const emit = defineEmits<{
  logEntry: []
}>()

const channelClasses: Record<string, string> = {
  Email: 'bg-slate-100 text-slate-600',
  Call: 'bg-slate-100 text-slate-600',
  Visit: 'bg-slate-100 text-slate-600',
  SMS: 'bg-slate-100 text-slate-600',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="border-t border-slate-100 px-6 py-4">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Communication log
      </p>
      <BaseButton variant="secondary" size="sm" @click="emit('logEntry')">+ Add</BaseButton>
    </div>
    <EmptyState
      v-if="entries.length === 0"
      class="mt-4"
      title="No log entries yet"
      description="Record calls, emails, or visits with this partner."
    />

    <table v-else class="mt-3 w-full text-sm">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50">
          <th class="px-4 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Date</th>
          <th class="px-4 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Channel</th>
          <th class="px-4 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Summary</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.id" class="border-b border-slate-50 last:border-0">
          <td class="px-4 py-3 text-slate-700">{{ formatDate(entry.date) }}</td>
          <td class="px-4 py-3">
            <span class="rounded px-2 py-0.5 font-mono text-xs" :class="channelClasses[entry.channel]">
              {{ entry.channel }}
            </span>
          </td>
          <td class="px-4 py-3 text-slate-700">{{ entry.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>