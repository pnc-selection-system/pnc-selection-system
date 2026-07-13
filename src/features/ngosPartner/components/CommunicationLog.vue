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
  <div class="border-t border-slate-100 px-4 py-2">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
        Communication log
      </p>
    </div>
    <div culass="pb-2">
      <BaseButton variant="secondary" class="!h-auto !w-full !border-dashed !py-2.5 !text-[13px]" @click="emit('logEntry')">+ Log entry</BaseButton>
    </div>
    <EmptyState
      v-if="entries.length === 0"
      class="mt-2"
      title="No log entries yet"
      description="Record calls, emails, or visits with this partner."
    />

    <table v-else class="mt-1 w-full border-collapse">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50/30">
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">Date</th>
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">Channel</th>
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">Summary</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.id" class="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/80">
          <td class="px-4 py-2.5 text-slate-600 text-[13px]">{{ formatDate(entry.date) }}</td>
          <td class="px-4 py-2.5">
            <span class="rounded px-2 py-0.5 font-mono text-[11px]" :class="channelClasses[entry.channel]">
              {{ entry.channel }}
            </span>
          </td>
          <td class="px-4 py-2.5 text-slate-600 text-[13px]">{{ entry.summary }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>