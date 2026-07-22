<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import type { NgoPartner } from '../types/partner'

defineProps<{
  partners: NgoPartner[]
  selectedId?: number | null
}>()

const emit = defineEmits<{
  select: [partner: NgoPartner]
  add: []
}>()
</script>

<template>
  <div class="rounded border border-slate-200 bg-white shadow-sm overflow-y-auto h-full">
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
            Type
          </th>
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(partner, index) in partners"
          :key="partner?.id ?? index"
          class="group cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
          :class="[
            partner?.id === selectedId 
              ? 'bg-blue-50/60' 
              : 'hover:bg-slate-50/80'
          ]"
          @click="emit('select', partner)"
        >
          <td class="px-4 py-2.5 text-[#2D3748] text-[13px] transition-colors group-hover:text-blue-600">
            {{ partner?.name ?? '-' }}
          </td>
          <td class="px-4 py-2.5 text-slate-500 text-[12px]">
            {{ partner?.type ?? '-' }}
          </td>
          <td class="px-4 py-2.5">
            <span
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
              :class="partner?.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="partner?.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'"
              />
              {{ partner?.status ?? '-' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
