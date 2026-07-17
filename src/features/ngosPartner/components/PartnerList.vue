<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import type { Partner } from '../types/partner'

defineProps<{
  partners: Partner[]
  selectedId?: string | null
}>()

const emit = defineEmits<{
  select: [partner: Partner]
  add: []
}>()

function onCurrentChange(row: Partner | null) {
  if (row) emit('select', row)
}
</script>

<template>
  <div class="overflow-hidden rounded border border-slate-200 bg-white">
    <div class="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
      <h2 class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
        Partners
      </h2>
      <BaseButton
        variant="secondary"
        class="!w-auto !rounded-md !border !border-slate-200 !px-3 !py-1.5 !text-xs !font-semibold !shadow-none flex items-center gap-1"
        @click="emit('add')"
      >
        <svg class="w-3 h-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10 5v10M5 10h10" stroke-linecap="round" />
        </svg>
        Add
      </BaseButton>
    </div>

    <DataTableWrapper
      :data="partners"
      :highlight-current="true"
      row-key="id"
      :current-row-key="selectedId"
      :bordered="false"
      empty-text="No partners yet"
      empty-description="Add your first NGO or partner organisation to start tracking candidates."
      @current-change="onCurrentChange"
    >
      <el-table-column label="Organisation" min-width="200">
        <template #default="{ row }">
          <span
            class="text-xs"
            :class="row.id === selectedId ? 'font-semibold text-slate-900' : 'text-slate-700'"
          >
            {{ row.organisation }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Candidates" width="120">
        <template #default="{ row }">
          <span class="text-xs text-slate-700">{{ row.candidateCount }}</span>
        </template>
      </el-table-column>
    </DataTableWrapper>
  </div>
</template>
