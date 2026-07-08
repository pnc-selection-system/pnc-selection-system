<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Campaign } from '../types'
import { emptyForm } from '../types'
import { useCampaigns } from '../composables/useCampaigns'

const props = defineProps<{
  visible: boolean
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addCampaign, updateCampaign } = useCampaigns()

const isEditing = ref(false)
const form = ref<Campaign>({ ...emptyForm })

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.campaign) {
        isEditing.value = true
        form.value = { ...props.campaign }
      } else {
        isEditing.value = false
        form.value = { ...emptyForm, id: crypto.randomUUID() }
      }
    }
  },
)

function saveCampaign() {
  if (!form.value.name.trim() || !form.value.startDate || !form.value.endDate) return

  if (isEditing.value) {
    updateCampaign({ ...form.value })
  } else {
    addCampaign({ ...form.value })
  }
  closeModal()
}

function closeModal() {
  form.value = { ...emptyForm }
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal()
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @keydown="handleKeydown"
  >
    <div class="modal-backdrop" @click="closeModal" aria-hidden="true"></div>
    <div class="modal-container" tabindex="-1" role="document">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0">
        <h2 id="modal-title" style="margin: 0; font-size: 18px; font-weight: 700; color: #111827">
          {{ isEditing ? 'Edit Campaign' : 'New Campaign' }}
        </h2>
        <button
          @click="closeModal"
          style="background: none; border: none; cursor: pointer; padding: 4px; color: #9ca3af; border-radius: 4px;"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveCampaign" style="padding: 20px 24px 24px">
        <div style="display: grid; gap: 20px">
          <div>
            <label for="name" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
              Campaign Name <span style="color: #ef4444">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="form-input"
              placeholder="Enter campaign name"
            />
          </div>

          <div>
            <label for="description" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="form-input"
              placeholder="Enter campaign description"
              style="resize: vertical; min-height: 80px"
            ></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
            <div>
              <label for="startDate" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                Start Date <span style="color: #ef4444">*</span>
              </label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="date"
                required
                class="form-input"
              />
            </div>
            <div>
              <label for="endDate" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                End Date <span style="color: #ef4444">*</span>
              </label>
              <input
                id="endDate"
                v-model="form.endDate"
                type="date"
                required
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label for="status" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
              Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="form-input"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb">
          <button
            type="button"
            @click="closeModal"
            class="campaign-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="campaign-btn-primary"
          >
            {{ isEditing ? 'Save Changes' : 'Create Campaign' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

