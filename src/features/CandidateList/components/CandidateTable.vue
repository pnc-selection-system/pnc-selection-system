<template>
  <DataTableWrapper
    :data="candidates"
    :loading="loading"
    empty-text="No candidates found"
    empty-description="Try adjusting your search or filter criteria"
  >
    <el-table-column prop="candidate_no" label="ID" width="75" />
    <el-table-column prop="fullName" label="Full Name" width="140" show-overflow-tooltip />
    <el-table-column prop="fullName_KH" label="Name (KH)" width="115" show-overflow-tooltip />
    <el-table-column prop="gender" label="Gender" width="80" align="center" />
    <el-table-column prop="province" label="Province" width="120" show-overflow-tooltip />
    <el-table-column prop="schoolName" label="School" width="190" show-overflow-tooltip />
    <el-table-column prop="dateOfBirth" label="DOB" width="95" />
    <el-table-column prop="phone" label="Phone" width="120" show-overflow-tooltip />
    <el-table-column label="NGO Name" width="150" show-overflow-tooltip>
      <template #default="{ row }">
        <span class="text-slate-400" v-if="!row.ngo">---</span>
        <span v-else>{{ row.ngo }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="130" align="center" show-overflow-tooltip >
      <template #default="{ row }">
        <el-select
          :model-value="row.status"
          size="small"
          class="status-select"
          @click.stop
          @update:model-value="$emit('update-status', { id: row.id, status: $event })"
        >
          <el-option label="Registered" value="Registered" />
          <el-option label="Exam Done" value="Exam Done" />
          <el-option label="Investigating" value="Investigating" />
          <el-option label="Assessed" value="Assessed" />
          <el-option label="Approved" value="Approved" />
          <el-option label="Rejected" value="Rejected" />
          <el-option label="On Hold" value="On Hold" />
        </el-select>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>

<script setup lang="ts">
import type { Candidate } from '../types/candidate'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'

defineProps<{ candidates: Candidate[]; loading: boolean }>()

defineEmits<{
  'update-status': [{ id: number; status: string }]
}>()
</script>

<style scoped>
.status-select {
  width: 100%;
}
.status-select :deep(.el-select__wrapper) {
  min-height: 26px;
  padding: 0 8px;
  font-size: 11px;
  box-shadow: 0 0 0 1px #d1d5db inset;
  border-radius: 4px;
  transition: box-shadow 0.15s ease;
}
.status-select :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #93c5fd inset;
}
.status-select :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #60a5fa inset;
}

/* Smaller dropdown caret icon */
.status-select :deep(.el-select__suffix) {
  font-size: 9px;
}
.status-select :deep(.el-select__caret) {
  font-size: 9px;
}
.status-select :deep(.el-select__suffix svg) {
  width: 10px;
  height: 10px;
}
</style>
