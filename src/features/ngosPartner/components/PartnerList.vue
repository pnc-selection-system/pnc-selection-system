<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import EmptyState from '../../../components/ui/EmptyState.vue'
import type { Partner } from '../types/partner'

defineProps<{
  partners: Partner[]
  selectedId?: string | null
}>()

const emit = defineEmits<{
  select: [partner: Partner]
  add: []
}>()
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
    <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <h2 class="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        Partners
      </h2>
      <BaseButton 
        class="!w-auto !px-4 !py-2 !text-[13px] font-bold" 
        @click="emit('add')"
      >
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
          <th class="px-6 py-3.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            Organisation
          </th>
          <th class="px-6 py-3.5 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
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
          <td class="px-6 py-5 font-bold text-[#2D3748] text-[15px] transition-colors group-hover:text-blue-600">
            {{ partner.organisation }}
          </td>
          <td class="px-6 py-5 font-medium text-slate-500 text-[14px]">
            {{ partner.candidateCount }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
