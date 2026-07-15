<script setup lang="ts">
import { ref, watch} from 'vue'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import { CampaignStatus } from '@/enums'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const props = defineProps<{
  visible: boolean
  campaign: Campaign | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addCampaign, updateCampaign, saving } = useCampaigns()

const currentYear = new Date().getFullYear()
const today = new Date().toISOString().split('T')[0] ?? ''

const isEditing = ref(false)
const form = ref({
  name: '',
  year: String(currentYear),
  condidate_total: '0',
  start_date: '',
  end_date: '',
  status: CampaignStatus.Active as CampaignStatus,
})
const errors = ref({ name: '', year: '', start_date: '', end_date: '', condidate_total: '' })

function validate(): boolean {
  const e = { name: '', year: '', start_date: '', end_date: '', condidate_total: '' }
  const year = Number(form.value.year)
  const condidate_total = Number(form.value.condidate_total)

  if (!form.value.name.trim()) e.name = 'Campaign name is required.'
  if (!year) e.year = 'Year is required.'
  else if (!isEditing.value && year < currentYear) e.year = `Year must be ${currentYear} or later.`
  if (condidate_total < 0) e.condidate_total = 'Total candidates cannot be negative.'
  if (!form.value.start_date) e.start_date = 'Start date is required.'
  else if (!isEditing.value && form.value.start_date < today) e.start_date = 'Start date cannot be in the past.'
  if (!form.value.end_date) e.end_date = 'End date is required.'
  else if (form.value.end_date < form.value.start_date) e.end_date = 'End date must be after start date.'

  errors.value = e
  return Object.values(e).every((v) => !v)
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      errors.value = { name: '', year: '', start_date: '', end_date: '', condidate_total: '' }
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
          year: String(currentYear),
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
  if (!validate()) return
  const year = Number(form.value.year)
  const condidate_total = Number(form.value.condidate_total)
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
        <p v-if="errors.name" class="-mt-3 text-xs text-red-500">{{ errors.name }}</p>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <BaseInput
              v-model="form.year"
              label="Year *"
              type="number"
              placeholder="e.g. 2026"
              name="year"
            />
            <p v-if="errors.year" class="mt-1 text-xs text-red-500">{{ errors.year }}</p>
          </div>
          <div>
            <BaseInput
              v-model="form.condidate_total"
              label="Total Candidates *"
              type="number"
              placeholder="e.g. 100"
              name="condidate_total"
            />
            <p v-if="errors.condidate_total" class="mt-1 text-xs text-red-500">{{ errors.condidate_total }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <BaseInput
              v-model="form.start_date"
              label="Start Date *"
              type="date"
              name="start_date"
            />
            <p v-if="errors.start_date" class="mt-1 text-xs text-red-500">{{ errors.start_date }}</p>
          </div>
          <div>
            <BaseInput
              v-model="form.end_date"
              label="End Date *"
              type="date"
              name="end_date"
            />
            <p v-if="errors.end_date" class="mt-1 text-xs text-red-500">{{ errors.end_date }}</p>
          </div>
        </div>

        <BaseSelect
          v-model="form.status"
          label="Status"
          :options="[
            { value: CampaignStatus.Active, label: 'Active' },
            { value: CampaignStatus.Closed, label: 'Closed' },
          ]"
        />
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

