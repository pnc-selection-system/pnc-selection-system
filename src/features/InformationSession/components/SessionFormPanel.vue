<script setup lang="ts">
import { computed, ref, watch, reactive, onMounted } from 'vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { fetchDistricts } from '../service/service'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import type { SessionFormData } from '../types/session'
import type { LocationOption, SessionFilterOptions } from '../types/filter'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

const props = defineProps<{
  modelValue: SessionFormData
  options: SessionFilterOptions
  campaigns?: { id: number; name: string; year: number }[]
  errors?: Record<string, string>
  isSaving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFormData]
  save: []
  cancel: []
}>()

const districts = ref<LocationOption[]>([])
const partners = ref<NgoPartner[]>([])
const partnersLoading = ref(false)

// --- Fetch NGO partners on mount ---
onMounted(async () => {
  partnersLoading.value = true
  try {
    partners.value = await fetchPartners()
  } catch (e) {
    console.error('Failed to load NGO partners:', e)
  } finally {
    partnersLoading.value = false
  }
})

// --- Track which fields the user has interacted with ---
const touched = reactive<Record<string, boolean>>({
  campaign_id: false,
  date: false,
  school: false,
  venue: false,
  expectedAttendance: false,
  attendanceCount: false,
  partnerType: false,
  partnerName: false,
  location: false,
  department: false,
  generation: false,
})
const wasSubmitted = ref(false)

function markTouched(field: string) {
  touched[field] = true
}

function markAllTouched() {
  Object.keys(touched).forEach(k => { touched[k] = true })
}

// --- Validation logic ---
function validateSessionForm(): Record<string, string> {
  const errs: Record<string, string> = {}
  const d = props.modelValue

  // campaign_id
  if (!d.campaign_id) {
    errs.campaign_id = 'Campaign is required'
  }

  // date
  if (!d.date?.trim()) {
    errs.date = 'Session date is required'
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) {
    errs.date = 'Invalid date format'
  }

  // school — required for Alumni partner type
  if (d.partnerType === 'Alumni') {
    if (!d.school?.trim()) {
      errs.school = 'School name is required'
    } else if (d.school.trim().length > 150) {
      errs.school = 'School name must be 150 characters or less'
    }
  }

  // venue (optional, max length check)
  if (d.venue?.trim() && d.venue.trim().length > 200) {
    errs.venue = 'Venue name must be 200 characters or less'
  }

  // expectedAttendance
  const expected = Number(d.expectedAttendance)
  if (!d.expectedAttendance || expected < 1) {
    errs.expectedAttendance = 'Must be at least 1'
  } else if (!Number.isInteger(expected)) {
    errs.expectedAttendance = 'Must be a whole number'
  }

  // attendanceCount
  const attendance = Number(d.attendanceCount)
  if (attendance < 0) {
    errs.attendanceCount = 'Cannot be negative'
  } else if (!Number.isInteger(attendance)) {
    errs.attendanceCount = 'Must be a whole number'
  }

  // Partner type must be selected
  if (!d.partnerType) {
    errs.partnerType = 'Please select a partner type'
  }

  // Partner-type-specific validations
  if (d.partnerType === 'School') {
    // School: needs a school partner name
    if (!d.partnerName?.trim()) {
      errs.partnerName = 'School partner name is required'
    } else if (d.partnerName.trim().length > 150) {
      errs.partnerName = 'School partner name must be 150 characters or less'
    }
  } else if (d.partnerType === 'Alumni') {
    // Alumni: needs a name and location
    if (!d.partnerName?.trim()) {
      errs.partnerName = 'Alumni name is required'
    } else if (d.partnerName.trim().length > 150) {
      errs.partnerName = 'Alumni name must be 150 characters or less'
    }
    if (!d.location?.trim()) {
      errs.location = 'Location is required'
    }
    if (!d.generation?.trim()) {
      errs.generation = 'Generation is required'
    } else if (d.generation.trim().length > 100) {
      errs.generation = 'Generation must be 100 characters or less'
    }
  } else if (d.partnerType === 'NGO') {
    // NGO: needs an NGO partner selected
    if (!d.partnerName?.trim()) {
      errs.partnerName = 'Please select an NGO partner'
    }
  } else if (d.partnerType === 'Officer') {
    // Officer: needs at least one officer name (input or added via host list)
    const hasOfficerNames = d.partnerName?.trim() || d.hosts.length > 0
    if (!hasOfficerNames) {
      errs.partnerName = 'At least one officer name is required'
    } else if (d.partnerName?.trim() && d.partnerName.trim().length > 150) {
      errs.partnerName = 'Officer name must be 150 characters or less'
    }
    if (!d.department?.trim()) {
      errs.department = 'Department is required'
    } else if (d.department.trim().length > 150) {
      errs.department = 'Department must be 150 characters or less'
    }
  }

  return errs
}

const validationErrors = computed(() => validateSessionForm())

const visibleErrors = computed<Record<string, string>>(() => {
  if (wasSubmitted.value) return validationErrors.value
  const errs: Record<string, string> = {}
  const all = validationErrors.value
  for (const key of Object.keys(all)) {
    if (touched[key]) {
      errs[key] = all[key]
    }
  }
  return errs
})

const isFormValid = computed(() => Object.keys(validationErrors.value).length === 0)
const errorCount = computed(() => Object.keys(validationErrors.value).length)

// --- Helper to get error for a field ---
function fieldError(field: string): string | undefined {
  return visibleErrors.value[field]
}

function hasError(field: string): boolean {
  return !!visibleErrors.value[field]
}

// --- Location cascade (Province → District) ---
const provinceOptions = computed(() =>
  props.options.provinces.map(p => ({ value: p.id, label: p.name }))
)
const districtOptions = computed(() =>
  districts.value.map(d => ({ value: d.id, label: d.name }))
)

watch(() => props.modelValue.province_id, async (id) => {
  districts.value = []
  if (id) {
    try {
      districts.value = await fetchDistricts(id)
      console.log(`Loaded ${districts.value.length} districts for province ${id}`)
    } catch (e) {
      console.error('Failed to load districts:', e)
    }
  }
}, { immediate: true })

function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

// --- Partner type change handler (single emit to avoid reactivity issues) ---
function onPartnerTypeChange(type: SessionFormData['partnerType']) {
  const reset: Partial<SessionFormData> = {
    partnerType: type,
    partnerName: '',
    location: '',
    // Start with one empty host input for School/NGO; Officer uses pill badges
    hosts: type === 'Officer' ? [] : [{ name: '' }],
    createdBy: [],
    createByInput: '',
  }
  // Clear school when switching to School, NGO, or Officer
  if (type === 'School' || type === 'NGO' || type === 'Officer') {
    reset.school = ''
  }
  emit('update:modelValue', { ...props.modelValue, ...reset })
}

// --- Created By management ---
function addCreateBy() {
  const name = props.modelValue.createByInput?.trim()
  if (!name) return
  const createdBy = [...props.modelValue.createdBy, { name }]
  emit('update:modelValue', { ...props.modelValue, createdBy, createByInput: '' })
}

function removeCreateBy(index: number) {
  const createdBy = props.modelValue.createdBy.filter((_, i) => i !== index)
  emit('update:modelValue', { ...props.modelValue, createdBy })
}

// --- Host management ---
function addHost() {
  const hosts = [...props.modelValue.hosts, { name: '' }]
  emit('update:modelValue', { ...props.modelValue, hosts })
}

// --- Add officer name from input field ---
function addOfficerName() {
  const name = props.modelValue.partnerName?.trim()
  if (!name) return
  const hosts = [...props.modelValue.hosts, { name }]
  emit('update:modelValue', { ...props.modelValue, hosts, partnerName: '' })
}

function removeHost(index: number) {
  const hosts = props.modelValue.hosts.filter((_, i) => i !== index)
  emit('update:modelValue', { ...props.modelValue, hosts })
}

function updateHost(index: number, name: string) {
  const hosts = props.modelValue.hosts.map((h, i) => i === index ? { ...h, name } : h)
  emit('update:modelValue', { ...props.modelValue, hosts })
}

function onProvinceChange(v: number) {
  markTouched('province_id')
  emit('update:modelValue', { ...props.modelValue, province_id: v, district_id: null })
}

function onDistrictChange(v: number) {
  markTouched('district_id')
  emit('update:modelValue', { ...props.modelValue, district_id: v })
}

function onSave() {
  wasSubmitted.value = true
  markAllTouched()
  if (isFormValid.value) {
    emit('save')
  }
}

const inputClass = computed(() =>
  'w-full rounded border bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:ring-2'
)

const normalInputClass = 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'
const errorInputClass = 'border-red-400 focus:border-red-500 focus:ring-red-100'

function inputClasses(field: string): string {
  const base = inputClass.value
  const state = hasError(field) ? errorInputClass : normalInputClass
  return `${base} ${state}`
}
</script>

<template>
  <div class="space-y-4">
    <!-- Campaign -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">CAMPAIGN *</label>
      <div :class="hasError('campaign_id') ? 'base-select-error' : ''">
        <BaseSelect
          :model-value="modelValue.campaign_id ?? ''"
          :options="(campaigns || []).map(c => ({ value: c.id, label: `${c.name} (${c.year})` }))"
          placeholder="Select campaign"
          @update:model-value="(v: string | number) => { markTouched('campaign_id'); update('campaign_id', Number(v)) }"
        />
      </div>
      <p v-if="hasError('campaign_id')" class="mt-1 text-xs text-red-500">{{ fieldError('campaign_id') }}</p>
    </div>

    <!-- Date -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DATE *</label>
      <input
        type="date"
        :value="modelValue.date"
        :class="inputClasses('date')"
        @change="update('date', ($event.target as HTMLInputElement).value)"
        @blur="markTouched('date')"
      />
      <p v-if="hasError('date')" class="mt-1 text-xs text-red-500">{{ fieldError('date') }}</p>
    </div>

    <!-- Province and District -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PROVINCE</label>
        <BaseSelect
          :model-value="modelValue.province_id ?? ''"
          :options="provinceOptions"
          placeholder="Province"
          @update:model-value="(v: string | number) => onProvinceChange(Number(v))"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DISTRICT</label>
        <BaseSelect
          :model-value="modelValue.district_id ?? ''"
          :options="districtOptions"
          placeholder="District"
          :disabled="!modelValue.province_id"
          @update:model-value="(v: string | number) => onDistrictChange(Number(v))"
        />
      </div>
    </div>

    <!-- Venue -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">VENUE</label>
      <input
        type="text"
        :value="modelValue.venue"
        :class="inputClasses('venue')"
        @input="update('venue', ($event.target as HTMLInputElement).value)"
        @blur="markTouched('venue')"
        placeholder="Enter venue name"
      />
      <p v-if="hasError('venue')" class="mt-1 text-xs text-red-500">{{ fieldError('venue') }}</p>
    </div>

    <!-- Attendance -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ATTENDANCE COUNT</label>
        <input
          type="number"
          :value="modelValue.attendanceCount"
          :class="inputClasses('attendanceCount')"
          @input="update('attendanceCount', Number(($event.target as HTMLInputElement).value))"
          @blur="markTouched('attendanceCount')"
          placeholder="0"
          min="0"
        />
        <p v-if="hasError('attendanceCount')" class="mt-1 text-xs text-red-500">{{ fieldError('attendanceCount') }}</p>
      </div>
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">EXPECTED ATTENDANCE *</label>
        <input
          type="number"
          :value="modelValue.expectedAttendance"
          :class="inputClasses('expectedAttendance')"
          @input="update('expectedAttendance', Number(($event.target as HTMLInputElement).value))"
          @blur="markTouched('expectedAttendance')"
          placeholder="0"
          min="0"
        />
        <p v-if="hasError('expectedAttendance')" class="mt-1 text-xs text-red-500">{{ fieldError('expectedAttendance') }}</p>
      </div>
    </div>

    <!-- Partner / Officer -->
    <div class="space-y-3">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PARTNER TYPE</label>
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="partnerType"
            value="School"
            :checked="modelValue.partnerType === 'School'"
            @change="onPartnerTypeChange('School')"
            class="accent-blue-600"
          />
          <span class="text-sm text-slate-700">School</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="partnerType"
            value="Alumni"
            :checked="modelValue.partnerType === 'Alumni'"
            @change="onPartnerTypeChange('Alumni')"
            class="accent-blue-600"
          />
          <span class="text-sm text-slate-700">Alumni</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="partnerType"
            value="NGO"
            :checked="modelValue.partnerType === 'NGO'"
            @change="onPartnerTypeChange('NGO')"
            class="accent-blue-600"
          />
          <span class="text-sm text-slate-700">NGO</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="partnerType"
            value="Officer"
            :checked="modelValue.partnerType === 'Officer'"
            @change="onPartnerTypeChange('Officer')"
            class="accent-blue-600"
          />
          <span class="text-sm text-slate-700">Officer</span>
        </label>
      </div>
      <p v-if="hasError('partnerType')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerType') }}</p>

      <!-- School partner: name input + hosts (like NGO but with text input instead of select) -->
      <template v-if="modelValue.partnerType === 'School'">
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SCHOOL NAME *</label>
          <input
            type="text"
            :value="modelValue.partnerName"
            :class="inputClasses('partnerName')"
            placeholder="Enter school partner name"
            @input="update('partnerName', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('partnerName')"
          />
          <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
        </div>

        <!-- Created By section for School (input + button like Officer pattern) -->
        <div class="space-y-2 pt-1">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">CREATED BY</label>
          
          <!-- Added names as rows -->
          <div
            v-for="(item, index) in modelValue.createdBy"
            :key="'cb-' + index"
            class="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <span class="flex-1 text-sm text-slate-700">{{ item.name }}</span>
            <button
              type="button"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Remove creator"
              @click="removeCreateBy(index)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Input field only (button removed) -->
          <input
            type="text"
            :value="modelValue.createByInput"
            class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter creator name"
            @input="update('createByInput', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Hosts section for School -->
        <div class="space-y-2 pt-1">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">HOST BY</label>
          <div
            v-for="(host, index) in modelValue.hosts"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              type="text"
              :value="host.name"
              class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Host by"
              @input="updateHost(index, ($event.target as HTMLInputElement).value)"
            />
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Remove host"
              @click="removeHost(index)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            class="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            @click="addHost"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Host by
          </button>
        </div>
      </template>

      <!-- Alumni partner: name + school + generation + location -->
      <template v-if="modelValue.partnerType === 'Alumni'">
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ALUMNI NAME *</label>
          <input
            type="text"
            :value="modelValue.partnerName"
            :class="inputClasses('partnerName')"
            @input="update('partnerName', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('partnerName')"
            placeholder="Enter alumni name"
          />
          <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SCHOOL *</label>
          <input
            type="text"
            :value="modelValue.school"
            :class="inputClasses('school')"
            @input="update('school', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('school')"
            placeholder="Enter school name"
          />
          <p v-if="hasError('school')" class="mt-1 text-xs text-red-500">{{ fieldError('school') }}</p>
        </div>
        <!-- Generation field for Alumni -->
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">GENERATION *</label>
          <input
            type="text"
            :value="modelValue.generation"
            :class="inputClasses('generation')"
            @input="update('generation', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('generation')"
            placeholder="Enter generation"
          />
          <p v-if="hasError('generation')" class="mt-1 text-xs text-red-500">{{ fieldError('generation') }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">LOCATION *</label>
          <input
            type="text"
            :value="modelValue.location"
            :class="inputClasses('location')"
            @input="update('location', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('location')"
            placeholder="Enter location"
          />
          <p v-if="hasError('location')" class="mt-1 text-xs text-red-500">{{ fieldError('location') }}</p>
        </div>
      </template>

      <!-- NGO partner: select from partner list + hosts -->
      <template v-if="modelValue.partnerType === 'NGO'">
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SELECT NGO *</label>
          <div :class="hasError('partnerName') ? 'base-select-error' : ''">
            <BaseSelect
              :model-value="modelValue.partnerName"
              :options="partners.map(p => ({ value: p.name, label: p.name }))"
              placeholder="Select an NGO partner"
              :disabled="partnersLoading"
              @update:model-value="(v: string | number) => { markTouched('partnerName'); update('partnerName', String(v)) }"
            />
          </div>
          <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
        </div>
        
        <!-- Created By section for NGO (same as School) -->
        <div class="space-y-2 pt-1">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">CREATED BY</label>
          
          <!-- Added names as rows -->
          <div
            v-for="(item, index) in modelValue.createdBy"
            :key="'cb-ngo-' + index"
            class="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <span class="flex-1 text-sm text-slate-700">{{ item.name }}</span>
            <button
              type="button"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Remove creator"
              @click="removeCreateBy(index)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Input field only -->
          <input
            type="text"
            :value="modelValue.createByInput"
            class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter creator name"
            @input="update('createByInput', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Hosts section for NGO -->
        <div class="space-y-2 pt-1">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">HOST BY</label>
          <div
            v-for="(host, index) in modelValue.hosts"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              type="text"
              :value="host.name"
              class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Host by"
              @input="updateHost(index, ($event.target as HTMLInputElement).value)"
            />
            <button
              type="button"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Remove host"
              @click="removeHost(index)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            class="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            @click="addHost"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add host
          </button>
        </div>
      </template>

      <!-- Officer partner: name list + add row + department -->
      <template v-if="modelValue.partnerType === 'Officer'">
        <!-- Added officer names as rows -->
        <div v-if="modelValue.hosts.length > 0" class="space-y-2">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">OFFICER NAMES</label>
          <div
            v-for="(host, index) in modelValue.hosts"
            :key="index"
            class="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <span class="flex-1 text-sm text-slate-700">{{ host.name }}</span>
            <button
              type="button"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Remove"
              @click="removeHost(index)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add new officer name row -->
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ADD OFFICER NAME</label>
          <input
            type="text"
            :value="modelValue.partnerName"
            :class="inputClasses('partnerName')"
            @input="update('partnerName', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('partnerName')"
            placeholder="Enter officer name"
          />
          <button
            type="button"
            class="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            title="Add officer name"
            @click="addOfficerName"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add name
          </button>
          <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
        </div>

        <!-- Department field for Officer -->
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DEPARTMENT *</label>
          <input
            type="text"
            :value="modelValue.department"
            :class="inputClasses('department')"
            @input="update('department', ($event.target as HTMLInputElement).value)"
            @blur="markTouched('department')"
            placeholder="Enter department name"
          />
          <p v-if="hasError('department')" class="mt-1 text-xs text-red-500">{{ fieldError('department') }}</p>
        </div>
      </template>
    </div>

    <!-- Validation summary -->
    <transition name="fade">
      <div
        v-if="wasSubmitted && !isFormValid"
        class="rounded border border-red-200 bg-red-50 px-3 py-2"
      >
        <p class="text-xs font-medium text-red-700">
          Please fix {{ errorCount }} error{{ errorCount !== 1 ? 's' : '' }} before saving.
        </p>
      </div>
    </transition>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-4">
      <BaseButton
        variant="secondary"
        :disabled="isSaving"
        @click="emit('cancel')"
      >
        Cancel
      </BaseButton>
      <BaseButton
        :disabled="isSaving"
        :loading="isSaving"
        @click="onSave"
      >
        {{ isSaving ? 'Saving...' : 'Save session' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Red border wrapper for el-select components */
.base-select-error :deep(.el-select .el-select__wrapper) {
  --el-select-border-color-hover: #f87171;
  border-color: #f87171 !important;
  box-shadow: 0 0 0 1px #f87171 !important;
}
.base-select-error :deep(.el-select .el-select__wrapper.is-focused) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}
</style>
