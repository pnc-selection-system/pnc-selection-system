<script setup lang="ts">
import { ref, watch } from 'vue'
import SubjectsTable from '../components/SubjectsTable.vue'
import ExamConfiguration from '../components/ExamConfiguration.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { useCacheFetch } from '@/composables/useCacheFetch'
import type { Campaign } from '@/features/campaign/types'
import { CampaignStatus } from '@/enums'

const selectedCampaignId = ref<number | null>(null)

const { data: campaigns } =
  useCacheFetch<Campaign[]>(
    'campaigns',
    () => fetchCampaigns(),
    { ttl: 60_000 },
  )

// Auto-select the first active campaign once data arrives
watch(
  campaigns,
  (list) => {
    if (!list || list.length === 0) return
    const activeCampaign = list.find(c => c.status === CampaignStatus.Active)
    if (activeCampaign) {
      selectedCampaignId.value = activeCampaign.id
    } else {
      const first = list[0]
      if (first) {
        selectedCampaignId.value = first.id
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader
        breadcrumb="Configuration"
        title="Exam Configuration"
      />

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px] items-start">
        <SubjectsTable :campaign-id="selectedCampaignId" />
        <ExamConfiguration />
      </div>
    </div>
  </div>
</template>
