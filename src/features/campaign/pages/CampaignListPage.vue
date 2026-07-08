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
  searchQuery,
  statusFilter,
  showInfoBox,
  filteredCampaigns,
  dismissInfoBox,
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
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-slate-400">Setup / Campaigns</p>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Campaigns</h1>
        </div>
        <BaseButton
          @click="openCreateModal"
          variant="primary"
          class="!w-auto !rounded !px-4 !py-3 gap-2 text-sm font-semibold shadow-lg shadow-slate-900/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New campaign
        </BaseButton>
      </div>

      <div v-if="showInfoBox" class="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm shadow-amber-100/60">
        <div class="flex items-start gap-4">
          <div class="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-white shadow-sm shadow-amber-500/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
              <path d="M12 8V13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1" fill="white"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium leading-6 text-amber-900">
              This page shows all available election campaigns. You can create, edit, or delete campaigns as needed.
            </p>
          </div>
          <button
            @click="dismissInfoBox"
            class="rounded-full p-2 text-amber-900 transition hover:bg-amber-100 hover:text-amber-950"
            title="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mb-6 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/40">
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <div class="relative flex-1 max-w-md">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search campaign..."
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div class="w-44">
            <BaseSelect
              v-model="statusFilter"
              :options="[
                { value: 'all', label: 'All campaigns' },
                { value: 'active', label: 'Active' },
                { value: 'closed', label: 'Closed' },
                { value: 'draft', label: 'Draft' },
              ]"
              clearable
              placeholder="Filter by status"
            />
          </div>

          <div class="ml-auto text-sm text-slate-500">
            <span class="font-semibold text-slate-900">{{ filteredCampaigns.length }}</span> campaign{{ filteredCampaigns.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-3xl bg-white shadow-sm shadow-slate-200/40">
        <table class="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Campaign</th>
              <th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Year</th>
              <th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Window</th>
              <th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Candidates</th>
              <th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
              <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredCampaigns.length === 0">
              <td colspan="6">
                <EmptyState
                  title="No campaign found"
                  description="Try adjusting your search or filter criteria"
                />
              </td>
            </tr>
            <tr v-for="campaign in filteredCampaigns" :key="campaign.id" class="border-b border-slate-200 transition hover:bg-slate-50">
              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ campaign.name }}</p>
                <p class="mt-1 text-sm text-slate-500 line-clamp-1">{{ campaign.description }}</p>
              </td>
              <td class="px-6 py-5 text-slate-700">{{ formatDateShort(campaign.startDate) }}</td>
              <td class="px-6 py-5 text-slate-700">{{ formatDateShort(campaign.endDate) }}</td>
              <td class="px-6 py-5">
                <BaseBadge
                  :type="campaign.status === 'active' ? 'success' : campaign.status === 'closed' ? 'info' : 'warning'"
                  dot
                >
                  {{ statusLabels[campaign.status] }}
                </BaseBadge>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEditModal(campaign)"
                    class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    title="Edit campaign"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="confirmDelete = campaign"
                    class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    title="Delete campaign"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    Delete
                  </button>
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

