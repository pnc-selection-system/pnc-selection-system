<script setup lang="ts">
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'

defineProps<{
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { deleteCampaign } = useCampaigns()

function handleDelete(id: string) {
  deleteCampaign(id)
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <div
    v-if="campaign"
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-modal-title"
    @keydown="handleKeydown"
  >
    <div class="modal-backdrop" @click="emit('close')" aria-hidden="true"></div>
    <div class="modal-container" style="max-width: 440px" tabindex="-1" role="document">
      <div style="padding: 28px 24px 24px; text-align: center">
        <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; margin: 0 auto 16px; border-radius: 50%; background-color: #fef2f2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 id="delete-modal-title" style="margin: 0 0 8px; font-size: 17px; font-weight: 700; color: #111827">Delete Campaign</h3>
        <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280; line-height: 1.5">
          Are you sure you want to delete the campaign
          <strong style="color: #111827">"{{ campaign.name }}"</strong>?
          This action cannot be undone.
        </p>

        <div style="display: flex; align-items: center; justify-content: center; gap: 12px">
          <button
            @click="emit('close')"
            class="campaign-btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="handleDelete(campaign.id)"
            class="campaign-btn-danger"
            autofocus
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

