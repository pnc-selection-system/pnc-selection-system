<script setup lang="ts">
import { computed } from 'vue'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const props = defineProps<{
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { deleteCampaign, deleting } = useCampaigns()

const visible = computed(() => !!props.campaign)
const message = computed(() =>
  props.campaign ? `Are you sure you want to delete "${props.campaign.name}"? This action cannot be undone.` : ''
)

async function handleDelete() {
  if (!props.campaign) return
  await deleteCampaign(props.campaign.id)
  emit('close')
}
</script>

<template>
  <ConfirmDialog
    :model-value="visible"
    title="Delete Campaign"
    :message="message"
    confirmText="Delete"
    :loading="deleting"
    @confirm="handleDelete"
    @cancel="emit('close')"
    @update:model-value="(v) => { if (!v) emit('close') }"
  />
</template>
