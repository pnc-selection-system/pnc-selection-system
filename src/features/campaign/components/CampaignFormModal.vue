<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import { CampaignStatus } from '@/enums'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  visible: boolean
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addCampaign, updateCampaign, saving } = useCampaigns()

const isEditing = ref(false)
const form = ref({
  name: '',
  year: String(new Date().getFullYear()),
  condidate_total: '0',
  start_date: '',
  end_date: '',
  status: CampaignStatus.Active as CampaignStatus,
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.campaign) {
        isEditing.value = true
        form.value = {
          name: props.campaign.name,
          year: String(props.campaign.year),
          condidate_total: String(props.campaign.condidate_total),
          start_date: props.campaign.start_date,
          end_date: props.campaign.end_date,
          status: props.campaign.status,
        }
      } else {
        isEditing.value = false
        form.value = {
          name: '',
          year: String(new Date().getFullYear()),
          condidate_total: '0',
          start_date: '',
          end_date: '',
          status: CampaignStatus.Active,
        }
      }
    }
  },
)

async function saveCampaign() {
  const year = Number(form.value.year)
  const condidate_total = Number(form.value.condidate_total)
  if (!form.value.name.trim() || !form.value.start_date || !form.value.end_date) return
  if (!year || condidate_total < 0) return

  const payload = { ...form.value, year, condidate_total }
  if (isEditing.value && props.campaign) {
    await updateCampaign(props.campaign.id, payload)
  } else {
    await addCampaign(payload)
  }
  closeModal()
}

function closeModal() {
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
        <BaseInput
          v-model="form.name"
          label="Campaign Name *"
          type="text"
          placeholder="Enter campaign name"
          name="name"
        />

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.year"
            label="Year *"
            type="number"
            placeholder="e.g. 2026"
            name="year"
          />
          <BaseInput
            v-model="form.condidate_total"
            label="Total Candidates *"
            type="number"
            placeholder="e.g. 100"
            name="condidate_total"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.start_date"
            label="Start Date *"
            type="date"
            name="start_date"
          />
          <BaseInput
            v-model="form.end_date"
            label="End Date *"
            type="date"
            name="end_date"
          />
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
            <option :value="CampaignStatus.Active">Active</option>
            <option :value="CampaignStatus.Closed">Closed</option>
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
          :loading="saving"
          :disabled="saving"
          @click="saveCampaign"
        >
          {{ isEditing ? 'Save Changes' : 'Create Campaign' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

