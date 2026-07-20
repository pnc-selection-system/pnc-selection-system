<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Campaign } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import { CampaignStatus } from '@/enums'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { fetchProvinces } from '@/features/CandidateList/services/provinceService'
import type { ProvinceData } from '@/features/CandidateList/services/provinceService'
import { getCampaign } from '../services/campaign'

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

function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

let provincesCache: ProvinceData[] | null = null
let provincesFetchPromise: Promise<ProvinceData[]> | null = null

const provinces = ref<ProvinceData[]>([])
const loadingProvinces = ref(false)

async function ensureProvinces() {
  if (provincesCache) {
    provinces.value = provincesCache
    return
  }
  if (!provincesFetchPromise) {
    provincesFetchPromise = fetchProvinces().catch(() => [])
  }
  loadingProvinces.value = true
  try {
    provincesCache = await provincesFetchPromise
    provinces.value = provincesCache
  } finally {
    loadingProvinces.value = false
  }
}

const isEditing = ref(false)
const form = ref({
  name: '',
  year: String(currentYear),
  condidate_total: '0',
  start_date: '',
  end_date: '',
  status: CampaignStatus.Active as CampaignStatus,
  province_ids: [] as number[],
})
const errors = ref({ name: '', year: '', start_date: '', end_date: '', condidate_total: '' })

watch(
  () => [form.value.start_date, form.value.end_date],
  ([start, end]) => {
    if (start && end && end < start) {
      errors.value.end_date = 'End date must be after start date.'
    } else if (errors.value.end_date === 'End date must be after start date.') {
      errors.value.end_date = ''
    }
  },
)

watch(
  () => form.value.year,
  (val) => {
    const year = Number(val)
    if (!isEditing.value && year && year < currentYear) {
      errors.value.year = `Year must be ${currentYear} or later.`
    } else {
      errors.value.year = ''
    }
  },
)

watch(
  () => form.value.start_date,
  (val) => {
    if (!isEditing.value && val && val < today) {
      errors.value.start_date = 'Start date cannot be in the past.'
    } else {
      errors.value.start_date = ''
    }
  },
)

const leadingZeroPattern = /^0+[1-9]\d*$/

function hasLeadingZeros(val: string): boolean {
  return leadingZeroPattern.test(val)
}

watch(
  () => form.value.condidate_total,
  (val) => {
    if (val && hasLeadingZeros(val)) {
      errors.value.condidate_total = 'Total candidates cannot have leading zeros.'
    } else if (errors.value.condidate_total === 'Total candidates cannot have leading zeros.') {
      errors.value.condidate_total = ''
    }
  },
)

function validate(): boolean {
  const e = { name: '', year: '', start_date: '', end_date: '', condidate_total: '' }
  const year = Number(form.value.year)
  const condidate_total_str = form.value.condidate_total
  const condidate_total = Number(condidate_total_str)

  if (!form.value.name.trim()) e.name = 'Campaign name is required.'
  if (!year) e.year = 'Year is required.'
  else if (!isEditing.value && year < currentYear) e.year = `Year must be ${currentYear} or later.`
  if (!condidate_total_str.trim()) {
    e.condidate_total = 'Total candidates is required.'
  } else if (hasLeadingZeros(condidate_total_str)) {
    e.condidate_total = 'Total candidates cannot have leading zeros.'
  } else if (condidate_total <= 0) {
    e.condidate_total = 'Total candidates must be greater than 0.'
  }
  if (!form.value.start_date) e.start_date = 'Start date is required.'
  else if (!isEditing.value && form.value.start_date < today) e.start_date = 'Start date cannot be in the past.'
  if (!form.value.end_date) e.end_date = 'End date is required.'
  else if (form.value.end_date < form.value.start_date) e.end_date = 'End date must be after start date.'

  errors.value = e
  return Object.values(e).every((v) => !v)
}

watch(
  async () => props.visible,
  async (val) => {
    if (val) {
      errors.value = { name: '', year: '', start_date: '', end_date: '', condidate_total: '' }
      await ensureProvinces()
      if (props.campaign) {
        isEditing.value = true
        let campaignData = props.campaign

        if (!campaignData.province_ids && !campaignData.provinces) {
          try {
            campaignData = await getCampaign(props.campaign.id)
          } catch (e) {
            console.error('Failed to load campaign details:', e)
          }
        }

        if (!provincesCache && campaignData.provinces && campaignData.provinces.length > 0) {
          provinces.value = campaignData.provinces.map((p) => ({
            id: p.id,
            name: p.name,
          }))
        }

        form.value = {
          name: campaignData.name,
          year: String(campaignData.year),
          condidate_total: String(campaignData.condidate_total),
          start_date: toDateInput(campaignData.start_date),
          end_date: toDateInput(campaignData.end_date),
          status: campaignData.status,
          province_ids: campaignData.province_ids ?? (campaignData.provinces ?? []).map((p) => p.id),
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
          province_ids: [],
        }
      }
    }
  },
  { immediate: true },
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
    <form @submit.prevent="saveCampaign" class="space-y-5" id="campaign-form">
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
              :min="isEditing ? undefined : today"
            />
            <p v-if="errors.start_date" class="mt-1 text-xs text-red-500">{{ errors.start_date }}</p>
          </div>
          <div>
            <BaseInput
              v-model="form.end_date"
              label="End Date *"
              type="date"
              name="end_date"
              :min="isEditing ? undefined : (form.start_date || today)"
            />
            <p v-if="errors.end_date" class="mt-1 text-xs text-red-500">{{ errors.end_date }}</p>
          </div>
        </div>

        <BaseSelect
          v-model="form.province_ids"
          label="Provinces"
          :options="provinces.map(p => ({ value: p.id, label: p.name }))"
          placeholder="Select provinces"
          multiple
          :loading="loadingProvinces"
        />

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
          type="button"
          variant="primary"
          @click="saveCampaign"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          :loading="saving"
          :disabled="saving"
        >
          {{ isEditing ? 'Save Changes' : 'Create Campaign' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
