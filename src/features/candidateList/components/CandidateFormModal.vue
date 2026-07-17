<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { fetchProvinces } from '../services/provinceService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import type { ProvinceData } from '../services/provinceService'
import type { Campaign } from '@/features/campaign/types'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: {
    firstName: string
    lastName: string
    firstNameKH: string
    lastNameKH: string
    gender: 'Male' | 'Female'
    dateOfBirth: string
    phone: string
    province_id: number
    schoolName: string
    campaign_id: number | null
    ngo_id: number | null
    status: string
  }): void
}>()

const proxyVisible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})

const provinces = ref<ProvinceData[]>([])
const campaigns = ref<Campaign[]>([])
const ngos = ref<NgoPartner[]>([])
const loadingOptions = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  firstNameKH: '',
  lastNameKH: '',
  gender: 'Male' as 'Male' | 'Female',
  dateOfBirth: '',
  phone: '',
  province_id: 1,
  schoolName: '',
  campaign_id: null as number | null,
  ngo_id: null as number | null,
  status: 'Register',
})

async function loadOptions() {
  if (provinces.value.length > 0) return
  loadingOptions.value = true
  try {
    const [provinceData, campaignData, ngoData] = await Promise.all([
      fetchProvinces(),
      fetchCampaigns(),
      fetchPartners(),
    ])
    provinces.value = provinceData
    campaigns.value = campaignData
    ngos.value = ngoData
    if (provinceData.length > 0) form.value.province_id = provinceData[0].id
  } catch {
    // Silently fail, user can still fill form manually
  } finally {
    loadingOptions.value = false
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.value = {
        firstName: '',
        lastName: '',
        firstNameKH: '',
        lastNameKH: '',
        gender: 'Male',
        dateOfBirth: '',
        phone: '',
        province_id: provinces.value[0]?.id || 1,
        schoolName: '',
        campaign_id: null,
        ngo_id: null,
        status: 'Register',
      }
      if (provinces.value.length === 0) {
        loadOptions()
      }
    }
  },
)

onMounted(() => {
  loadOptions()
})

function handleSave() {
  if (!form.value.firstName.trim()) return
  emit('save', {
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
    firstNameKH: form.value.firstNameKH.trim(),
    lastNameKH: form.value.lastNameKH.trim(),
    gender: form.value.gender,
    dateOfBirth: form.value.dateOfBirth,
    phone: form.value.phone,
    province_id: form.value.province_id,
    schoolName: form.value.schoolName,
    campaign_id: form.value.campaign_id,
    ngo_id: form.value.ngo_id,
    status: form.value.status,
  })
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal v-model="proxyVisible" title="New Candidate" width="480px">
    <div class="space-y-3">
      <!-- Full Name -->
      <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Full Name</p>
      <div class="grid grid-cols-2 gap-3">
        <BaseInput
          v-model="form.firstName"
          label="First Name *"
          placeholder="First name"
        />
        <BaseInput
          v-model="form.lastName"
          label="Last Name"
          placeholder="Last name"
        />
      </div>

      <!-- Name (KH) -->
      <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Name (KH)</p>
      <div class="grid grid-cols-2 gap-3">
        <BaseInput
          v-model="form.firstNameKH"
          label="First Name (KH)"
          placeholder="ឈ្មោះ"
        />
        <BaseInput
          v-model="form.lastNameKH"
          label="Last Name (KH)"
          placeholder="ត្រកូល"
        />
      </div>

      <!-- Gender + DOB -->
      <div class="grid grid-cols-2 gap-3">
        <BaseSelect
          v-model="form.gender"
          label="Gender *"
          :options="[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ]"
        />
        <BaseInput
          v-model="form.dateOfBirth"
          label="Date of Birth"
          type="date"
        />
      </div>

      <!-- Province + School -->
      <div class="grid grid-cols-2 gap-3">
        <BaseSelect
          v-model="form.province_id"
          label="Province *"
          :options="provinces.map(p => ({ value: p.id, label: p.name }))"
          :disabled="loadingOptions && provinces.length === 0"
        />
        <BaseInput
          v-model="form.schoolName"
          label="School"
          placeholder="School name"
        />
      </div>

      <!-- Phone -->
      <BaseInput
        v-model="form.phone"
        label="Phone"
        placeholder="+855 ..."
      />

      <!-- Organization -->
      <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Organization</p>
      <div class="grid grid-cols-2 gap-3">
        <BaseSelect
          v-model="form.ngo_id"
          label="NGO"
          :options="[
            { value: null, label: 'None' },
            ...ngos.map(n => ({ value: n.id, label: n.name })),
          ]"
          :disabled="loadingOptions && ngos.length === 0"
        />
        <BaseSelect
          v-model="form.campaign_id"
          label="Campaign"
          :options="[
            { value: null, label: 'None' },
            ...campaigns.map(c => ({ value: c.id, label: c.name })),
          ]"
          :disabled="loadingOptions && campaigns.length === 0"
        />
      </div>

      <!-- Status -->
      <BaseSelect
        v-model="form.status"
        label="Status"
        :options="[
          { value: 'Register', label: 'Register' },
          { value: 'Investigating', label: 'Investigating' },
          { value: 'Assessed', label: 'Assessed' },
          { value: 'Approved', label: 'Approved' },
          { value: 'Rejected', label: 'Rejected' },
          { value: 'On Hold', label: 'On Hold' },
        ]"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <BaseButton
          variant="secondary"
          class="!w-auto"
          @click="emit('update:modelValue', false)"
        >
          Cancel
        </BaseButton>
        <BaseButton
          class="!w-auto"
          :disabled="!form.firstName.trim() || loadingOptions"
          @click="handleSave"
        >
          {{ loadingOptions ? 'Loading...' : 'Create Candidate' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
