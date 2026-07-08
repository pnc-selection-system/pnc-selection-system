<script setup lang="ts">
import { ref } from 'vue'
import type { Campaign } from '../types'
import { statusLabels, formatDateShort } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import CampaignFormModal from '../components/CampaignFormModal.vue'
import CampaignDeleteModal from '../components/CampaignDeleteModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const {
  statusFilter,
  yearFilter,
  yearOptions,
  filteredCampaigns,
} = useCampaigns()

const showFormModal = ref(false)
const editingCampaign = ref<Campaign | null>(null)
const confirmDelete = ref<Campaign | null>(null)

function openCreateModal() {
  editingCampaign.value = null
  showFormModal.value = true
}

function openEditModal(campaign: Campaign) {
  editingCampaign.value = campaign
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingCampaign.value = null
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1200px] px-0 py-8 sm:px-0">
      <div class="rounded-3xl p-6​">
        <div class="flex flex-col gap-0">
          <p class="text-[10px] font-semibold uppercase text-slate-500">SETUP / CAMPAIGNS</p>
          <h1 class="text-[24px] font-semibold tracking-tight text-slate-900">Campaigns</h1>
        </div>
      </div>
      <!-- Header / Filter Row -->
      <div class="mb-6 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="min-w-[160px] max-w-[240px]">
            <BaseSelect
              v-model="yearFilter"
              :options="[
                { value: 'all', label: 'Year: All' },
                ...yearOptions.map(y => ({ value: y, label: `Year: ${y}` })),
              ]"
              clearable
              placeholder="Year"
            />
          </div>
          <div class="min-w-[160px] max-w-[240px]">
            <BaseSelect
              v-model="statusFilter"
              :options="[
                { value: 'all', label: 'Status: All' },
                { value: 'active', label: 'Status: Active' },
                { value: 'closed', label: 'Status: Closed' },
              ]"
              clearable
              placeholder="Status"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <BaseButton
            @click="openCreateModal"
            variant="primary"
            class="!w-auto !rounded-[4px] !px-4 !py-2 text-sm font-semibold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New campaign
          </BaseButton>
        </div>
      </div>

      <div class="overflow-hidden rounded border border-slate-200 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-slate-500">
              <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Campaign</th>
              <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Start Date</th>
              <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">End Date</th>
              <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Candidates</th>
              <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Status</th>
              <th class="px-4 py-2.5 text-center text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="filteredCampaigns.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-xs text-slate-500">
                <EmptyState
                  title="No campaign found"
                  description="Try adjusting your search or filter criteria"
                />
              </td>
            </tr>
            <tr v-for="campaign in filteredCampaigns" :key="campaign.id">
              <td class="px-4 py-3">
                <p class="text-slate-900 text-xs">{{ campaign.name }}</p>
              </td>
              <td class="px-4 py-3 text-xs text-slate-700">{{ formatDateShort(campaign.startDate) }}</td>
              <td class="px-4 py-3 text-xs text-slate-700">{{ formatDateShort(campaign.endDate) }}</td>
              <td class="px-4 py-3 text-xs text-slate-700">{{ campaign.candidates ?? '-' }}</td>
              <td class="px-4 py-3">
                <BaseBadge
                  :type="campaign.status === 'active' ? 'success' : 'info'"
                  size="small"
                >
                  {{ statusLabels[campaign.status] }}
                </BaseBadge>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="inline-flex items-center gap-2">
                  <BaseButton
                    variant="secondary"
                    class="!w-auto !rounded !px-2 !py-1 gap-1 text-[0.6rem] font-semibold"
                    @click="openEditModal(campaign)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                    Edit
                  </BaseButton>
                  <BaseButton
                    variant="secondary"
                    class="!w-auto !rounded !px-2 !py-1 gap-1 text-[0.6rem] font-semibold !border-rose-200 !bg-rose-50 !text-rose-700"
                    @click="confirmDelete = campaign"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    Delete
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CampaignFormModal
      :visible="showFormModal"
      :campaign="editingCampaign"
      @close="closeFormModal"
    />

    <CampaignDeleteModal
      :campaign="confirmDelete"
      @close="confirmDelete = null"
    />
  </div>
</template>




