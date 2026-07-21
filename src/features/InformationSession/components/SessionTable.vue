<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import FormAction from '@/components/ui/FormAction.vue'
import { formatDateShort } from '@/utils/date'
import type { Session } from '../types/session'

const props = defineProps<{
  sessions: Session[]
  selectedId: number | null
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [session: Session]
  edit: [session: Session]
  'view-candidates': [session: Session]
}>()

const router = useRouter()
const currentRow = ref<Session | null>(null)

watch(
  () => props.selectedId,
  (id) => {
    if (id === null) {
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
  if (row) emit('select', row)
}

function viewDetail(session: Session) {
  router.push({ name: 'information-session-detail', params: { id: session.id } })
}
</script>

<template>
  <DataTableWrapper
    :data="sessions"
    :loading="loading"
    :highlight-current="true"
    row-key="id"
    empty-text="No sessions found"
    empty-description="Try adjusting your search or filter criteria"
    @current-change="onCurrentChange"
  >
    <el-table-column label="Date" width="130">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ formatDateShort(row.session_date) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Province" min-width="140">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.province || '—' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Venue" min-width="160">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.venue || '—' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Host Name" min-width="160">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.hosts?.[0]?.host_name || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Attendance" width="130">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ (row.attendance_count ?? 0).toLocaleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Expected" width="120">
      <template #default="{ row }">
        <span class="text-xs text-slate-500">{{ (row.expected_attendance ?? 0).toLocaleString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Actions" width="160" fixed="right">
      <template #default="{ row }">
        <FormAction
          @edit="emit('edit', row)"
          @view="viewDetail(row)"
        />
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>
