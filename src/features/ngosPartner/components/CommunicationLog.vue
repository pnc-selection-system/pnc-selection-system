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
  <div class="border-t border-slate-200 px-4 py-2.5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
        Communication log
      </h3>
      <BaseButton
        variant="secondary"
        class="!w-auto !rounded-md !border !border-slate-200 !px-2.5 !py-1 !text-xs !font-semibold !shadow-none flex items-center gap-1"
        @click="emit('logEntry')"
      >
        <svg class="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10 5v10M5 10h10" stroke-linecap="round" />
        </svg>
        Log entry
      </BaseButton>
    </div>
    <EmptyState
      v-if="entries.length === 0"
      class="mt-2"
      title="No log entries yet"
      description="Record calls, emails, or visits with this partner."
    />

    <table v-else class="min-w-full text-left text-sm">
      <thead>
        <tr class="border-b border-slate-200 bg-slate-50">
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Date</th>
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Channel</th>
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Summary</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr v-for="entry in entries" :key="entry.id" class="group hover:bg-blue-50/40 transition-all">
          <td class="px-4 py-2 text-xs text-slate-700">{{ formatDate(entry.date) }}</td>
          <td class="px-4 py-2">
            <span class="rounded px-2 py-0.5 text-xs" :class="channelClasses[entry.channel]">
              {{ entry.channel }}
            </span>
          </td>
          <td class="px-4 py-2 text-xs text-slate-700">{{ entry.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
