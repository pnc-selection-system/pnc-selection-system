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
        <span
          v-if="row.exam_result === 'Pass'"
          class="inline-block px-2 py-0.5 rounded text-[0.6rem] font-semibold bg-green-100 text-green-700"
        >
          Pass {{ row.exam_score }}
        </span>
        <span
          v-else-if="row.exam_result === 'Fail'"
          class="inline-block px-2 py-0.5 rounded text-[0.6rem] font-semibold bg-red-100 text-red-700"
        >
          Fail {{ row.exam_score }}
        </span>
        <span v-else class="text-slate-300 text-xs">—</span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="130">
      <template #default="{ row }">
        <StatusBadge :status="row.status" />
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>

<script setup lang="ts">
import type { Candidate } from '../types/candidate'
import StatusBadge from './StatusBadge.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'

defineProps<{ candidates: Candidate[]; loading: boolean }>()
</script>
