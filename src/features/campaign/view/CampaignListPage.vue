<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Campaign } from '../types'
import { statusLabels } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import CampaignToolbar from '../components/CampaignToolbar.vue'
import CampaignFormModal from '../components/CampaignFormModal.vue'

import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import FormAction from '@/components/ui/FormAction.vue'
import { formatDateShort } from '@/utils/date'
import { CampaignStatus } from '@/enums'

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

function viewCampaign(campaign: Campaign) {
  router.push({ name: 'campaign-detail', params: { id: campaign.id } })
}

</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <PageHeader breadcrumb="SETUP / CAMPAIGNS" title="Campaigns" />

      <div v-if="loading && filteredCampaigns.length === 0" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else-if="error" class="mb-4">
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

      <DataTableWrapper
        :data="filteredCampaigns"
        :loading="loading"
        empty-text="No campaign found"
        empty-description="Try adjusting your search or filter criteria"
      >
        <el-table-column label="Campaign" min-width="100">
          <template #default="{ row }">
            <p class="text-xs" :class="row.status === CampaignStatus.Active ? 'font-bold text-slate-900' : 'text-slate-900'">
              {{ row.name }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="year" label="Year" width="150" />
        <el-table-column label="Start Date" width="160">
          <template #default="{ row }">
            <span class="text-xs text-slate-700">{{ formatDateShort(row.start_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="End Date" width="160">
          <template #default="{ row }">
            <span class="text-xs text-slate-700">{{ formatDateShort(row.end_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="condidate_total" label="Candidates" width="150" />
        <el-table-column label="Status" width="120">
          <template #default="{ row }">
            <BaseBadge :type="row.status === CampaignStatus.Active ? 'primary' : 'info'" size="small">
              {{ statusLabels[row.status as CampaignStatus] }}
            </BaseBadge>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="160" fixed="right">
          <template #default="{ row }">
            <FormAction
              @edit="openEditModal(row)"
              @view="viewCampaign(row)"
            />
          </template>
        </el-table-column>
      </DataTableWrapper>
      </template>

    </div>

    <CampaignFormModal :visible="showFormModal" :campaign="editingCampaign" @close="closeFormModal" />

  </div>
</template>
