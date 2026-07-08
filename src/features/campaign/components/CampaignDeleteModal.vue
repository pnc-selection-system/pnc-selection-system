<script setup lang="ts">
import { computed } from 'vue'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { deleteCampaign } = useCampaigns()

const visible = computed(() => !!props.campaign)

function handleDelete(id: string) {
  deleteCampaign(id)
  emit('close')
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="visible"
    width="440px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <div class="py-2 text-center">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 class="mb-2 text-lg font-bold text-slate-900">Delete Campaign</h3>
      <p v-if="campaign" class="text-sm leading-relaxed text-slate-500">
        Are you sure you want to delete the campaign
        <strong class="text-slate-900">"{{ campaign.name }}"</strong>?
        This action cannot be undone.
      </p>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          v-if="campaign"
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium !border-red-300 !bg-red-50 !text-red-700 hover:!bg-red-100"
          @click="handleDelete(campaign.id)"
          autofocus
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Delete
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

