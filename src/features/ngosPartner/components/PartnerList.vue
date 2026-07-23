<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '../../../components/base/BaseButton.vue'
import BaseBadge from '../../../components/base/BaseBadge.vue'
import BaseIcon from '../../../components/base/BaseIcon.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import type { NgoPartner, NgoPartnerStatus } from '../types/partner'

const props = defineProps<{
  partners: NgoPartner[]
  selectedId?: number | null
}>()

const emit = defineEmits<{
  select: [partner: NgoPartner]
  add: []
}>()

const currentRow = ref<NgoPartner | null>(null)

watch(
  () => props.selectedId,
  (id) => {
    if (id === null) {
      currentRow.value = null
      return
    }
    const found = props.partners.find((p) => p.id === id)
    if (found) currentRow.value = found
  },
  { immediate: true },
)

function onCurrentChange(row: NgoPartner | null) {
  if (!row) return
  currentRow.value = row
  emit('select', row)
}

function statusBadgeType(status: NgoPartnerStatus | undefined): 'success' | 'info' {
  return status === 'active' ? 'success' : 'info'
}
</script>

<template>
  <div class="rounded border border-slate-200 bg-white shadow-sm overflow-y-auto h-full">
    <div class="flex items-center justify-between border-b border-slate-100 px-4 py-2">
      <h2 class="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
        Partners
      </h2>
      <BaseButton
        variant="primary"
        class="!w-auto !rounded-[4px] !px-3 !py-1.5 text-xs font-semibold"
        @click="emit('add')"
      >
        <BaseIcon :size="12" :stroke-width="2.5">
          <path d="M12 5v14M5 12h14" />
        </BaseIcon>
        Add
      </BaseButton>
    </div>

    <DataTableWrapper
      :data="partners"
      :highlight-current="true"
      row-key="id"
      :current-row-key="selectedId"
      empty-text="No partners yet"
      empty-description="Add your first NGO or partner organisation to start tracking candidates."
      @current-change="onCurrentChange"
    >
      <el-table-column label="Organisation" min-width="180">
        <template #default="{ row }">
          <span class="text-[13px] text-[#2D3748]" :class="{ 'font-semibold': row?.id === selectedId }">{{ row?.name ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" min-width="120">
        <template #default="{ row }">
          <span class="text-[12px] text-slate-500">{{ row?.type ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="110">
        <template #default="{ row }">
          <BaseBadge :type="statusBadgeType(row?.status)" size="small">
            {{ row?.status ?? '-' }}
          </BaseBadge>
        </template>
      </el-table-column>
    </DataTableWrapper>
  </div>
</template>
