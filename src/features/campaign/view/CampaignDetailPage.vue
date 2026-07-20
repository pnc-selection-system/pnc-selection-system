<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampaigns } from '../composables/useCampaigns.ts'
import { statusLabels } from '../types/index.ts'
import { formatDateShort } from '@/utils/date'
import { CampaignStatus } from '@/enums'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { campaigns, loadCampaigns, loading } = useCampaigns()

const campaign = computed(() =>
  campaigns.value.find((c) => c.id === Number(route.params.id)) ?? null,
)

onMounted(() => {
  if (campaigns.value.length === 0) {
    loadCampaigns()
  }
})
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <div class="flex items-center justify-between">
        <PageHeader
          breadcrumb="SETUP / CAMPAIGNS"
          :title="campaign ? `${campaign.name}` : 'Campaign Detail'"
          class="!mb-0"
        />
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-3 !py-1.5 gap-1 text-xs font-semibold"
          @click="router.back()"
        >
          ← Back
        </BaseButton>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <div v-else-if="!campaign" class="rounded border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
        Campaign not found.
      </div>

      <div v-else class="rounded border border-slate-200/85 bg-white shadow-sm overflow-hidden">
        <div class="border-b border-slate-100 bg-slate-50/50 px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-xl font-bold text-slate-900 tracking-tight">{{ campaign.name }}</h2>
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span class="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                Year {{ campaign.year }}
              </span>
              <span>•</span>
              <span>Updated {{ formatDateShort(campaign.updated_at || campaign.created_at) }}</span>
            </div>
          </div>
          <div>
            <BaseBadge :type="campaign.status === CampaignStatus.Active ? 'primary' : 'info'" size="large" class="!px-3 !py-1 !text-xs font-bold uppercase tracking-wider">
              {{ statusLabels[campaign.status] }}
            </BaseBadge>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div class="md:col-span-2 p-8 space-y-6">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Campaign Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="flex items-start gap-3">
                <div class="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Total Candidates</p>
                  <p class="mt-1 text-base font-bold text-slate-800">{{ campaign.condidate_total }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Start Date</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800">{{ formatDateShort(campaign.start_date) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="p-2 bg-rose-50 rounded-lg text-rose-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">End Date</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800">{{ formatDateShort(campaign.end_date) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="p-2 bg-slate-50 rounded-lg text-slate-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Created Date</p>
                  <p class="mt-1 text-sm font-semibold text-slate-800">{{ formatDateShort(campaign.created_at || campaign.start_date) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-8 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Provinces Covered</h3>
              <span class="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {{ campaign.provinces?.length || 0 }}
              </span>
            </div>
            <div class="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
              <span
                v-for="prov in campaign.provinces"
                :key="prov.id"
                class="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/60 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition duration-150 cursor-default"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {{ prov.name }}
              </span>
              <div v-if="!campaign.provinces || campaign.provinces.length === 0" class="w-full text-center py-8 text-sm text-slate-400 italic">
                No provinces selected.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
