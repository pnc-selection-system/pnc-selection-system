<script setup lang="ts">
import type { Campaign } from '../types'
import { statusLabels } from '../types'
import { formatDateShort } from '@/utils/date'
import { CampaignStatus } from '@/enums'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

defineProps<{
  campaign: Campaign
}>()

const emit = defineEmits<{
  view: [campaign: Campaign]
  edit: [campaign: Campaign]
}>()
</script>

<template>
  <tr class="hover:bg-blue-50/60 transition-colors">
    <td class="px-4 py-1">
      <p class="text-xs text-slate-900" :class="{ 'font-bold': campaign.status === CampaignStatus.Active }">
        {{ campaign.name }}
      </p>
    </td>
    <td class="px-4 py-1 text-xs text-slate-700">{{ campaign.year }}</td>
    <td class="px-4 py-1 text-xs text-slate-700">{{ formatDateShort(campaign.start_date) }}</td>
    <td class="px-4 py-1 text-xs text-slate-700">{{ formatDateShort(campaign.end_date) }}</td>
    <td class="px-4 py-1 text-xs text-slate-700">{{ campaign.condidate_total }}</td>
    <td class="px-4 py-1">
      <BaseBadge :type="campaign.status === CampaignStatus.Active ? 'primary' : 'info'" size="small">
        {{ statusLabels[campaign.status] }}
      </BaseBadge>
    </td>
    <td class="px-4 py-1 text-center">
      <div class="inline-flex items-center gap-0.5">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded-md !px-1.5 !py-1 !border-blue-200 !bg-blue-50 !text-blue-600 hover:!bg-blue-100 hover:!text-blue-800 active:!scale-95"
          title="View campaign"
          @click="emit('view', campaign)"
        >
          <BaseIcon :size="12">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </BaseIcon>
        </BaseButton>
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded-md !px-1.5 !py-1 hover:!bg-slate-100 active:!scale-95"
          title="Edit campaign"
          @click="emit('edit', campaign)"
        >
          <BaseIcon :size="12">
            <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </BaseIcon>
        </BaseButton>

      </div>
    </td>
  </tr>
</template>
