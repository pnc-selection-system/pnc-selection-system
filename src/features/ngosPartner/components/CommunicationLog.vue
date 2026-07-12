<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import type { CommunicationLogEntry } from '../types/communication'

defineProps<{
  entries: CommunicationLogEntry[]
}>()

const emit = defineEmits<{
  logEntry: []
}>()



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

    <DataTableWrapper
      :data="entries"
      :bordered="false"
      empty-text="No log entries yet"
      empty-description="Record calls, emails, or visits with this partner."
    >
      <el-table-column label="Date" width="110">
        <template #default="{ row }">
          <span class="text-xs text-slate-700">{{ formatDate(row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Channel" width="100">
        <template #default="{ row }">
          <BaseBadge type="info" size="small">
            {{ row.channel }}
          </BaseBadge>
        </template>
      </el-table-column>
      <el-table-column label="Summary" min-width="200">
        <template #default="{ row }">
          <span class="text-xs text-slate-700">{{ row.summary }}</span>
        </template>
      </el-table-column>
    </DataTableWrapper>
  </div>
</template>
