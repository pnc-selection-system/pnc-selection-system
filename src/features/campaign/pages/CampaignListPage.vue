<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import CampaignPageHeader from '../components/CampaignPageHeader.vue'
import CampaignToolbar from '../components/CampaignToolbar.vue'
import CampaignTableRow from '../components/CampaignTableRow.vue'
import CampaignFormModal from '../components/CampaignFormModal.vue'
import CampaignDeleteModal from '../components/CampaignDeleteModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const router = useRouter()

const {
  loading,
  statusFilter,
  yearFilter,
  yearOptions,
  filteredCampaigns,
  error,
  loadCampaigns,
} = useCampaigns()

onMounted(() => loadCampaigns())

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
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <CampaignPageHeader breadcrumb="SETUP / CAMPAIGNS" title="Campaigns" />

      <div v-if="loading && filteredCampaigns.length === 0" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else-if="error">
        <ErrorAlert :message="error" />
        <div class="mt-3 flex justify-end">
          <BaseButton @click="loadCampaigns" variant="secondary" class="!w-auto !rounded !px-3 !py-1 text-sm">
            Retry
          </BaseButton>
        </div>
      </div>

      <template v-else>
        <CampaignToolbar
          v-model:year-filter="yearFilter"
          v-model:status-filter="statusFilter"
          :year-options="yearOptions"
          @create="openCreateModal"
        />

        <div class="overflow-hidden rounded border border-slate-200 bg-white">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50">
                <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Campaign</th>
                <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Year</th>
                <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Start Date</th>
                <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">End Date</th>
                <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Candidates</th>
                <th class="px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th class="px-4 py-2.5 text-center text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-if="filteredCampaigns.length === 0">
                <td colspan="7" class="px-4 py-8 text-center">
                  <EmptyState title="No campaign found" description="Try adjusting your search or filter criteria" />
                </td>
              </tr>
              <CampaignTableRow
                v-for="campaign in filteredCampaigns"
                :key="campaign.id"
                :campaign="campaign"
                @view="router.push({ name: 'campaign-detail', params: { id: $event.id } })"
                @edit="openEditModal"
                @delete="confirmDelete = $event"
              />
            </tbody>
          </table>
        </div>
      </template>

    </div>

    <CampaignFormModal :visible="showFormModal" :campaign="editingCampaign" @close="closeFormModal" />
    <CampaignDeleteModal :campaign="confirmDelete" @close="confirmDelete = null" />
  </div>
</template>
