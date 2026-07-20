<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { fetchProvinces } from '../services/provinceService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import { checkDuplicateCandidate } from '../services/candidateService'
import type { ProvinceData } from '../services/provinceService'
import type { Campaign } from '@/features/campaign/types'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

const props = defineProps<{
  modelValue?: boolean
  saving?: boolean
  error?: string | null
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
  status: 'Registered',
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
        status: 'Registered',
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

onUnmounted(() => {
  if (checkTimer) clearTimeout(checkTimer)
})

// --- Real-time duplicate validation ---
const phoneChecking = ref(false)
const phoneDuplicates = ref<{ fullName: string; phone: string }[]>([])

// Debounced check: when phone changes, search for existing candidates with this phone
let checkTimer: ReturnType<typeof setTimeout> | null = null

async function checkPhoneDuplicate() {
  const phone = form.value.phone.trim()
  if (!phone || phone.length < 6) {
    phoneChecking.value = false
    phoneDuplicates.value = []
    return
  }

  phoneChecking.value = true
  try {
    const existing = await checkDuplicateCandidate(phone)
    if (existing.length > 0) {
      const fullName = `${form.value.firstName} ${form.value.lastName}`.toLowerCase().trim()
      // Filter to exact name + phone matches
      const matches = existing.filter((c) => {
        const existingName = `${c.first_name} ${c.last_name}`.toLowerCase().trim()
        return fullName && existingName === fullName
      })
      phoneDuplicates.value = matches.map((c) => ({
        fullName: `${c.first_name} ${c.last_name}`,
        phone: c.phone || '',
      }))
    } else {
      phoneDuplicates.value = []
    }
  } catch {
    // Silently fail; user can still submit the form
    phoneDuplicates.value = []
  } finally {
    phoneChecking.value = false
  }
}

// Watch phone with debounce
watch(
  () => form.value.phone,
  () => {
    if (checkTimer) clearTimeout(checkTimer)
    checkTimer = setTimeout(() => {
      checkPhoneDuplicate()
    }, 400)
  },
)

// Re-check when name changes (if we already have a phone)
watch(
  [() => form.value.firstName, () => form.value.lastName],
  () => {
    if (form.value.phone.trim().length >= 6 && phoneDuplicates.value.length > 0) {
      checkPhoneDuplicate()
    }
  },
)

// Reset validation state when modal closes
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      phoneDuplicates.value = []
      phoneChecking.value = false
    }
  },
)

function handleSave() {
  if (!form.value.firstName.trim() || props.saving || phoneDuplicates.value.length > 0) return
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
}
</script>

<template>
  <BaseModal v-model="proxyVisible" title="New Candidate" width="480px">
    <!-- Error banner -->
    <div
      v-if="error"
      class="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2"
    >
      <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div class="text-sm text-red-700">{{ error }}</div>
    </div>

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
      <div>
        <BaseInput
          v-model="form.phone"
          label="Phone"
          placeholder="+855 ..."
        />
        <!-- Inline duplicate validation -->
        <div class="mt-1.5 min-h-[20px]">
          <!-- Checking spinner -->
          <div
            v-if="phoneChecking"
            class="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Checking for duplicates...
          </div>
          <!-- Duplicate warning -->
          <div
            v-else-if="phoneDuplicates.length > 0"
            class="flex items-start gap-1.5 text-xs text-amber-700"
          >
            <svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <span class="font-medium">Duplicate detected!</span>
              <span class="block text-amber-600">
                A candidate with the name
                <span class="font-semibold">"{{ phoneDuplicates[0].fullName }}"</span>
                and this phone number already exists.
              </span>
            </div>
          </div>
        </div>
      </div>

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
          { value: 'Registered', label: 'Registered' },
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
          :disabled="!form.firstName.trim() || loadingOptions || saving || phoneDuplicates.length > 0"
          @click="handleSave"
        >
          <template v-if="saving">
            <svg class="-ml-1 mr-1.5 h-3.5 w-3.5 animate-spin inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </template>
          <template v-else>Create Candidate</template>
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
