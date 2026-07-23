<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import BaseIcon from '../../../components/base/BaseIcon.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import type { CommunicationLogEntry } from '../types/communication'

defineProps<{
  entries: CommunicationLogEntry[]
}>()

const emit = defineEmits<{
  logEntry: []
}>()

const channelClasses: Record<string, string> = {
  Email: 'bg-blue-50 text-blue-700 border border-blue-200',
  Call: 'bg-green-50 text-green-700 border border-green-200',
  Visit: 'bg-purple-50 text-purple-700 border border-purple-200',
  Meeting: 'bg-amber-50 text-amber-700 border border-amber-200',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="border-t border-slate-100 px-4 py-2">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">
        Communication log
      </p>
      <BaseButton
        variant="primary"
        class="!w-auto !rounded-[4px] !px-3 !py-1.5 text-xs font-semibold"
        @click="emit('logEntry')"
      >
        <BaseIcon :size="12" :stroke-width="2.5">
          <path d="M12 5v14M5 12h14" />
        </BaseIcon>
        Log entry
      </BaseButton>
    </div>

    <DataTableWrapper
      :data="entries"
      row-key="id"
      empty-text="No log entries yet"
      empty-description="Record calls, emails, or visits with this partner."
    >
      <el-table-column label="Date" width="110">
        <template #default="{ row }">
          <span class="text-[13px] text-slate-600">{{ formatDate(row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Channel" width="120">
        <template #default="{ row }">
          <span class="rounded px-2 py-0.5 font-mono text-[11px]" :class="channelClasses[row.channel]">
            {{ row.channel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Summary" min-width="200">
        <template #default="{ row }">
          <span class="text-[13px] text-slate-600">{{ row.summary }}</span>
        </template>
      </el-table-column>
    </DataTableWrapper>
  </div>
</template>
