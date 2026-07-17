<script setup lang="ts">
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import type { CandidateResultRow } from '../types/candidate'
import { SUBJECT_WEIGHTS } from '../types/candidate'

defineProps<{
  rows: CandidateResultRow[]
}>()
</script>

<template>
  <DataTableWrapper
    :data="rows"
    row-key="rank"
    empty-text="No results found"
    empty-description="Try selecting a different round or province"
  >
    <el-table-column label="Rank" width="90">
      <template #default="{ row }">
        <span class="text-slate-500">#{{ row.rank }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Candidate" min-width="160">
      <template #default="{ row }">
        <span :class="row.rank <= 2 ? 'font-semibold text-slate-800' : 'text-blue-600'">
          {{ row.candidate }}
        </span>
      </template>
    </el-table-column>

    <el-table-column :label="`Math ${SUBJECT_WEIGHTS.math}`" width="90">
      <template #default="{ row }">
        <span class="text-slate-700">{{ row.scores.math }}</span>
      </template>
    </el-table-column>

    <el-table-column :label="`Khmer ${SUBJECT_WEIGHTS.khmer}`" width="90">
      <template #default="{ row }">
        <span class="text-slate-700">{{ row.scores.khmer }}</span>
      </template>
    </el-table-column>

    <el-table-column :label="`Eng ${SUBJECT_WEIGHTS.eng}`" width="90">
      <template #default="{ row }">
        <span class="text-slate-700">{{ row.scores.eng }}</span>
      </template>
    </el-table-column>

    <el-table-column :label="`Logic ${SUBJECT_WEIGHTS.logic}`" width="90">
      <template #default="{ row }">
        <span class="text-slate-700">{{ row.scores.logic }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Total" width="100">
      <template #default="{ row }">
        <span class="font-semibold text-slate-800">{{ row.total.toFixed(1) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="Result" width="110">
      <template #default="{ row }">
        <BaseBadge :type="row.result === 'Pass' ? 'success' : 'danger'" size="small">
          {{ row.result }}
        </BaseBadge>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>
