<script setup lang="ts">
import { computed } from 'vue'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

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
        <BaseIcon name="warning" :size="28" color="#dc2626" :stroke-width="1.5" />
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
          <BaseIcon name="delete" :size="16" :stroke-width="2" />
          Delete
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

