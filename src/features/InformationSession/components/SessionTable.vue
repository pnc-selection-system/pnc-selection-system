<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import { formatDateShort } from '@/utils/date'
import type { Session } from '../types/session'

const props = defineProps<{
  sessions: Session[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [session: Session]
  'view-candidates': [session: Session]
}>()

const currentRow = ref<Session | null>(null)

// Sync selectedId -> currentRow
watch(
  () => props.selectedId,
  (id) => {
    if (!id) {
      currentRow.value = null
      return
    }
    const found = props.sessions.find((s) => s.id === id)
    if (found) currentRow.value = found
  },
  { immediate: true },
)

function onCurrentChange(row: Session | null) {
  currentRow.value = row
  if (row) {
    emit('select', row)
  }
}
</script>

<template>
  <DataTableWrapper
    :data="sessions"
    :highlight-current="true"
    row-key="id"
    empty-text="No sessions found"
    empty-description="Try adjusting your search or filter criteria"
    @current-change="onCurrentChange"
  >
    <el-table-column label="Date" width="130">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ formatDateShort(row.date) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Province / School" min-width="220">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.province }} · {{ row.school }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Attendance" width="130">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.attendance.toLocaleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Candidates" width="140">
      <template #default="{ row }">
        <BaseBadge type="primary" size="small">
          {{ row.convertedCount }} converted
        </BaseBadge>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>
