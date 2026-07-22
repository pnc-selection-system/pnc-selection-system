<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampaigns } from '../composables/useCampaigns.ts'
import { statusLabels } from '../types/index.ts'
import { formatDateShort } from '@/utils/date'
import { CampaignStatus } from '@/enums'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { campaigns } = useCampaigns()

const campaign = computed(() =>
  campaigns.value.find((c) => c.id === Number(route.params.id)) ?? null,
)
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <PageHeader
        breadcrumb="SETUP / CAMPAIGNS / VIEW"
        :title="campaign?.name ?? 'Campaign Detail'"
      >
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-3 !py-1.5 gap-1 text-xs font-semibold"
          @click="router.back()"
        >
          ← Back
        </BaseButton>
      </PageHeader>

      <!-- Not found -->
      <div v-if="!campaign" class="rounded border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Campaign not found.
      </div>

      <!-- Detail Card -->
      <div v-else class="rounded border border-slate-200 bg-white overflow-hidden">
        <div class="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">

          <div class="space-y-5 p-6">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Campaign Name</p>
              <p class="mt-1 text-sm font-medium text-slate-900">{{ campaign.name }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Year</p>
              <p class="mt-1 text-sm text-slate-700">{{ campaign.year }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Status</p>
              <div class="mt-1">
                <BaseBadge :type="campaign.status === CampaignStatus.Active ? 'success' : 'info'" size="small">
                  {{ statusLabels[campaign.status] }}
                </BaseBadge>
              </div>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Total Candidates</p>
              <p class="mt-1 text-sm text-slate-700">{{ campaign.condidate_total }}</p>
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Start Date</p>
              <p class="mt-1 text-sm text-slate-700">{{ formatDateShort(campaign.start_date) }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">End Date</p>
              <p class="mt-1 text-sm text-slate-700">{{ formatDateShort(campaign.end_date) }}</p>
            </div>
            <div v-if="campaign.created_at">
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Created At</p>
              <p class="mt-1 text-sm text-slate-700">{{ formatDateShort(campaign.created_at) }}</p>
            </div>
            <div v-if="campaign.updated_at">
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Last Updated</p>
              <p class="mt-1 text-sm text-slate-700">{{ formatDateShort(campaign.updated_at) }}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
