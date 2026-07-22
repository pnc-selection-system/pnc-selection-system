<template>
  <DataTableWrapper
    :data="candidates"
    :loading="loading"
    row-key="id"
    empty-text="No candidates found"
    empty-description="Try adjusting your search or filter criteria"
    @row-click="(row) => $emit('row-click', row)"
  >
    <el-table-column prop="candidate_no" label="ID" width="70" />
    <el-table-column label="Candidate Info" width="350" show-overflow-tooltip>
      <template #default="{ row }">
        <div class="candidate-info">
          <div class="info-name">{{ row.fullName }}</div>
          <div class="info-kh">{{ row.fullName_KH }}</div>
          <div class="info-meta">
            <span class="meta-item">
              <span class="meta-label">Gender:</span> {{ row.gender }}
            </span>
            <span class="meta-separator">•</span>
            <span class="meta-item">
              <span class="meta-label">DOB:</span> {{ row.dateOfBirth }}
            </span>
            <span class="meta-separator">•</span>
            <span class="meta-item">
              <span class="meta-label">Phone:</span>
              <span v-if="row.phone" class="meta-value">{{ row.phone }}</span>
              <span v-else class="meta-value meta-empty">---</span>
            </span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="province" label="Province" width="180" show-overflow-tooltip />
    <el-table-column prop="schoolName" label="School" width="250" show-overflow-tooltip />
    <el-table-column label="NGO Name" width="200" show-overflow-tooltip>
      <template #default="{ row }">
        <span class="text-slate-400" v-if="!row.ngo">---</span>
        <span v-else>{{ row.ngo }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="140" align="center" show-overflow-tooltip >
      <template #default="{ row }">
        <el-select
          :model-value="row.status"
          size="small"
          :class="['status-select', statusClass(row.status)]"
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
  'row-click': [row: Candidate]
}>()

function statusClass(status: string): string {
  const map: Record<string, string> = {
    'Registered': 'status-registered',
    'Exam Done': 'status-exam-done',
    'Investigating': 'status-investigating',
    'Assessed': 'status-assessed',
    'Approved': 'status-approved',
    'Rejected': 'status-rejected',
    'On Hold': 'status-on-hold',
  }
  return map[status] || ''
}
</script>

<style scoped>
.candidate-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.4;
}

.info-name {
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
}

.info-kh {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 1px;
}

.info-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 4px;
  font-size: 11px;
  color: #475569;
}

.meta-item {
  white-space: nowrap;
}

.meta-label {
  color: #94a3b8;
  margin-right: 1px;
}

.meta-value {
  color: #334155;
}

.meta-empty {
  color: #94a3b8;
  font-style: italic;
}

.meta-separator {
  color: #cbd5e1;
  font-size: 10px;
}

.status-select {
  width: 100%;
}
.status-select :deep(.el-select__wrapper) {
  min-height: 26px;
  padding: 0 8px;
  font-size: 11px;
  box-shadow: 0 0 0 1px #d1d5db inset;
  border-radius: 4px;
  transition: box-shadow 0.15s ease, background-color 0.15s ease;
}
.status-select :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #93c5fd inset;
}
.status-select :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #60a5fa inset;
}

/* Status color variants — border & text only */
.status-select.status-registered :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #10b981 inset;
  background-color: #f0fdf4;
}
.status-select.status-registered :deep(.el-select__selected-item) {
  color: #065f46;
  font-weight: 600;
}

.status-select.status-exam-done :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #f59e0b inset;
  background-color: #fffbeb;
}
.status-select.status-exam-done :deep(.el-select__selected-item) {
  color: #92400e;
  font-weight: 600;
}

.status-select.status-investigating :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
  background-color: #eff6ff;
}
.status-select.status-investigating :deep(.el-select__selected-item) {
  color: #1e40af;
  font-weight: 600;
}

.status-select.status-assessed :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #8b5cf6 inset;
  background-color: #f5f3ff;
}
.status-select.status-assessed :deep(.el-select__selected-item) {
  color: #5b21b6;
  font-weight: 600;
}

.status-select.status-approved :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #059669 inset;
  background-color: #ecfdf5;
}
.status-select.status-approved :deep(.el-select__selected-item) {
  color: #064e3b;
  font-weight: 600;
}

.status-select.status-rejected :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #ef4444 inset;
  background-color: #fef2f2;
}
.status-select.status-rejected :deep(.el-select__selected-item) {
  color: #991b1b;
  font-weight: 600;
}

.status-select.status-on-hold :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #94a3b8 inset;
  background-color: #f8fafc;
}
.status-select.status-on-hold :deep(.el-select__selected-item) {
  color: #475569;
  font-weight: 600;
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
