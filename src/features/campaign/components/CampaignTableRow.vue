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
  delete: [campaign: Campaign]
}>()
</script>

<template>
  <tr>
    <td class="px-4 py-3">
      <p class="text-xs text-slate-900" :class="{ 'font-bold': campaign.status === CampaignStatus.Active }">
        {{ campaign.name }}
      </p>
    </td>
    <td class="px-4 py-3 text-xs text-slate-700">{{ campaign.year }}</td>
    <td class="px-4 py-3 text-xs text-slate-700">{{ formatDateShort(campaign.start_date) }}</td>
    <td class="px-4 py-3 text-xs text-slate-700">{{ formatDateShort(campaign.end_date) }}</td>
    <td class="px-4 py-3 text-xs text-slate-700">{{ campaign.condidate_total }}</td>
    <td class="px-4 py-3">
      <BaseBadge :type="campaign.status === CampaignStatus.Active ? 'success' : 'info'" size="small">
        {{ statusLabels[campaign.status] }}
      </BaseBadge>
    </td>
    <td class="px-4 py-3 text-center">
      <div class="inline-flex items-center gap-0.5">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-1 !py-0 gap-0.5 text-[0.5rem] font-semibold !border-blue-200 !bg-blue-50 !text-blue-700"
          @click="emit('view', campaign)"
        >
          <BaseIcon name="view" :size="9" />
          View
        </BaseButton>
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-1 !py-0 gap-0.5 text-[0.5rem] font-semibold"
          @click="emit('edit', campaign)"
        >
          <BaseIcon name="edit" :size="9" />
          Edit
        </BaseButton>
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-1 !py-0 gap-0.5 text-[0.5rem] font-semibold !border-rose-200 !bg-rose-50 !text-rose-700"
          @click="emit('delete', campaign)"
        >
          <BaseIcon name="delete" :size="9" />
          Delete
        </BaseButton>
      </div>
    </td>
  </tr>
</template>
