<template>
  <DataTableWrapper
    :data="candidates"
    :loading="loading"
    empty-text="No candidates found"
    empty-description="Try adjusting your search or filter criteria"
  >
    <el-table-column prop="candidate_no" label="ID" width="90" />
    <el-table-column prop="name" label="Name" min-width="160" />
    <el-table-column prop="province" label="Province" min-width="140" />
    <el-table-column prop="ngo" label="NGO" min-width="140" />
    <el-table-column label="Exam" width="110">
      <template #default="{ row }">
        <BaseBadge
          v-if="row.exam_result === 'Pass'"
          type="success"
          size="small"
        >
          Pass {{ row.exam_score }}
        </BaseBadge>
        <BaseBadge
          v-else-if="row.exam_result === 'Fail'"
          type="danger"
          size="small"
        >
          Fail {{ row.exam_score }}
        </BaseBadge>
        <span v-else class="text-slate-300 text-xs">—</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="130">
      <template #default="{ row }">
        <BaseBadge type="info" size="small">
          {{ row.status }}
        </BaseBadge>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>

<script setup lang="ts">
import type { Candidate } from '../types/candidate'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'

defineProps<{ candidates: Candidate[]; loading: boolean }>()
</script>
