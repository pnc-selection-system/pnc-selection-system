<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { fetchProvinces } from '../services/provinceService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import type { ProvinceData } from '../services/provinceService'
import type { Campaign } from '@/features/campaign/types'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
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
  () => props.visible,
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
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="emit('close')"
      />

      <!-- Modal -->
      <div class="relative w-full max-w-[480px] rounded-xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 class="text-base font-semibold text-slate-900">New Candidate</h2>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            @click="emit('close')"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="max-h-[65vh] space-y-3 overflow-y-auto px-5 py-3">
          <!-- Row 1: Full Name (as in table column "Full Name") -->
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

          <!-- Row 2: Name (KH) (as in table column "Name (KH)") -->
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

          <!-- Row 3: Gender + DOB (as in table columns "Gender", "DOB") -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <BaseSelect
                v-model="form.gender"
                label="Gender *"
                :options="[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]"
              />
            </div>
            <BaseInput
              v-model="form.dateOfBirth"
              label="Date of Birth"
              type="date"
            />
          </div>

          <!-- Row 4: Province + School (as in table columns "Province", "School") -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <BaseSelect
                v-model="form.province_id"
                label="Province *"
                :options="provinces.map(p => ({ value: p.id, label: p.name }))"
                :disabled="loadingOptions && provinces.length === 0"
              />
            </div>
            <BaseInput
              v-model="form.schoolName"
              label="School"
              placeholder="School name"
            />
          </div>

          <!-- Row 5: Phone (as in table column "Phone") -->
          <BaseInput
            v-model="form.phone"
            label="Phone"
            placeholder="+855 ..."
          />

          <!-- Row 6: NGO + Campaign (as in table columns "NGO", "Campaign") -->
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Organization</p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <BaseSelect
                v-model="form.ngo_id"
                label="NGO"
                :options="[
                  { value: null, label: 'None' },
                  ...ngos.map(n => ({ value: n.id, label: n.name })),
                ]"
                :disabled="loadingOptions && ngos.length === 0"
              />
            </div>
            <div>
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
          </div>

          <!-- Row 6: Status (as in table column "Status") -->
          <div>
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
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!form.firstName.trim() || loadingOptions"
            @click="handleSave"
          >
            {{ loadingOptions ? 'Loading...' : 'Create Candidate' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
