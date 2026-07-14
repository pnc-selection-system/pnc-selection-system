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
  <div class="rounded border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
    <div class="border-b border-slate-100 px-4 py-2">
      <h2 class="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
        Partners
      </h2>
    </div>
    <div class="px-4 pb-2">
      <BaseButton variant="secondary" class="!h-auto !w-full !border-dashed !py-2.5 !text-[13px]" @click="emit('add')">
        + Add
      </BaseButton>
    </div>

    <EmptyState 
      v-if="partners.length === 0" 
      title="No partners yet" 
      description="Add your first NGO or partner organisation to start tracking candidates." 
      class="py-12"
    />

    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50/30">
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
            Organisation
          </th>
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
            Candidates
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="partner in partners"
          :key="partner.id"
          class="group cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
          :class="[
            partner.id === selectedId 
              ? 'bg-blue-50/60' 
              : 'hover:bg-slate-50/80'
          ]"
          @click="emit('select', partner)"
        >
          <td class="px-4 py-2.5 text-[#2D3748] text-[13px] transition-colors group-hover:text-blue-600">
            {{ partner.organisation }}
          </td>
          <td class="px-4 py-2.5 text-slate-500 text-[12px]">
            {{ partner.candidateCount }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
