<template>
  <DataTableWrapper
    :data="candidates"
    :loading="loading"
    row-key="id"
    empty-text="No candidates found"
    empty-description="Try adjusting your search or filter criteria"
    @row-click="(row) => $emit('row-click', row)"
  >
    <el-table-column prop="student_id" label="ID" width="65" show-overflow-tooltip>
      <template #default="{ row }">
        <span class="whitespace-nowrap font-medium text-slate-700">{{ row.student_id }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Candidate Info" show-overflow-tooltip>
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
    <el-table-column prop="province" label="Province" show-overflow-tooltip />
    <el-table-column prop="schoolName" label="School" show-overflow-tooltip />
    <el-table-column label="NGO" show-overflow-tooltip>
      <template #default="{ row }">
        <span class="text-slate-400" v-if="!row.ngo">---</span>
        <span v-else>{{ row.ngo }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="110" align="center" show-overflow-tooltip >
      <template #default="{ row }">
        <span class="inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold" :class="statusBadgeClass(row.status)">{{ row.status }}</span>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>

<script setup lang="ts">
import type { Candidate } from '../types/candidate'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'

defineProps<{ candidates: Candidate[]; loading: boolean }>()

defineEmits<{
  'row-click': [row: Candidate]
}>()

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    'Registered': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    'Exam Done': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    'Investigating': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    'Assessed': 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20',
    'Approved': 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    'Rejected': 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    'On Hold': 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20',
  }
  return map[status] || 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20'
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
</style>
