<script setup lang="ts">
import type { Candidate } from '../types/index'
import { statusConfigs } from '../types/index'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'

function getBadgeType(status: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' {
  switch (status) {
    case 'approved':
    case 'assessed': return 'success'
    case 'exam_done':
    case 'investigating': return 'warning'
    case 'rejected': return 'danger'
    case 'on_hold': return 'primary'
    case 'registered':
    default: return 'info'
  }
}

defineProps<{
  candidate: Candidate
}>()

const mockHistory = [
  { date: '2025-06-10', from: 'pending', to: 'investigating', by: 'Mr. Vuthy', note: 'Initial review completed' },
  { date: '2025-06-05', from: null, to: 'pending', by: 'System', note: 'Candidate registered' },
]
</script>

<template>
  <DataTableWrapper
    :data="mockHistory"
    :bordered="false"
    :empty-text="'No status history'"
    :empty-description="'Status changes will appear here.'"
  >
    <el-table-column prop="date" label="Date" width="130" />
    <el-table-column label="From" width="160">
      <template #default="{ row }">
        <BaseBadge
          v-if="row.from"
          :type="getBadgeType(row.from)"
          size="small"
        >
          {{ statusConfigs[row.from as keyof typeof statusConfigs]?.label }}
        </BaseBadge>
        <span v-else class="text-xs text-slate-400">—</span>
      </template>
    </el-table-column>
    <el-table-column label="To" width="160">
      <template #default="{ row }">
        <BaseBadge
          :type="getBadgeType(row.to)"
          size="small"
        >
          {{ statusConfigs[row.to as keyof typeof statusConfigs]?.label }}
        </BaseBadge>
      </template>
    </el-table-column>
    <el-table-column prop="by" label="Changed By" width="150" />
    <el-table-column prop="note" label="Note" min-width="200" />
  </DataTableWrapper>
</template>
