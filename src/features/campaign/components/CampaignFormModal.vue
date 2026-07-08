<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Campaign } from '../types'
import { emptyForm } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

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
</script>

<template>
  <BaseModal
    :model-value="visible"
    :title="isEditing ? 'Edit Campaign' : 'New Campaign'"
    width="560px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <form @submit.prevent="saveCampaign">
      <div class="space-y-5">
        <div>
          <label for="name" class="mb-1.5 block text-sm font-medium text-slate-700">
            Campaign Name <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter campaign name"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="mb-1.5 block text-sm font-medium text-slate-700">
              Start Date <span class="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              v-model="form.startDate"
              type="date"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label for="endDate" class="mb-1.5 block text-sm font-medium text-slate-700">
              End Date <span class="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="date"
              required
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label for="status" class="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            v-model="form.status"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          type="button"
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="saveCampaign"
        >
          {{ isEditing ? 'Save Changes' : 'Create Campaign' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

