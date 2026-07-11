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

    <EmptyState 
      v-if="partners.length === 0" 
      title="No partners yet" 
      description="Add your first NGO or partner organisation to start tracking candidates." 
      class="py-12"
    />

    <table v-else class="min-w-full text-left text-sm">
      <thead>
        <tr class="border-b border-slate-200 bg-slate-50">
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Organisation
          </th>
          <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Candidates
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr
          v-for="partner in partners"
          :key="partner.id"
          class="group hover:bg-blue-50/40 transition-all cursor-pointer"
          :class="{ 'bg-blue-50/40': partner.id === selectedId }"
          @click="emit('select', partner)"
        >
          <td
            class="px-4 py-2 text-xs"
            :class="partner.id === selectedId ? 'font-semibold text-slate-900' : 'text-slate-700'"
          >
            {{ partner.organisation }}
          </td>
          <td class="px-4 py-2 text-xs text-slate-700">
            {{ partner.candidateCount }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
