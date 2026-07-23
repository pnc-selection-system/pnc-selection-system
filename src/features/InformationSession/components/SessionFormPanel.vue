<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { fetchDistricts, fetchCommunes, fetchVillages } from '../service/service'
import type { SessionFormData } from '../types/session'
import type { LocationOption, SessionFilterOptions } from '../types/filter'

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
const communes = ref<LocationOption[]>([])
const villages = ref<LocationOption[]>([])

// --- Track which fields the user has interacted with ---
const touched = reactive<Record<string, boolean>>({
  campaign_id: false,
  date: false,
  time: false,
  village_id: false,
  school: false,
  expectedAttendance: false,
  attendanceCount: false,
  partnerType: false,
  ngoName: false,
  hostBy: false,
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

  // time
  if (!d.time?.trim()) {
    errs.time = 'Session time is required'
  } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(d.time)) {
    errs.time = 'Invalid time format (HH:MM required)'
  }

  // village_id (required on create)
  if (!d.id && !d.village_id) {
    errs.village_id = 'Village is required'
  }

  // school
  if (!d.school?.trim()) {
    errs.school = 'School name is required'
  } else if (d.school.trim().length > 150) {
    errs.school = 'School name must be 150 characters or less'
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

  // partnerType / ngoName
  if (d.partnerType === 'NGO' && !d.ngoName?.trim()) {
    errs.ngoName = 'NGO name is required when partner type is NGO'
  } else if (d.ngoName?.trim() && d.ngoName.trim().length > 150) {
    errs.ngoName = 'NGO name must be 150 characters or less'
  }

  // hostBy
  if (!d.hostBy?.trim()) {
    errs.hostBy = 'Host name is required'
  } else if (d.hostBy.trim().length > 150) {
    errs.hostBy = 'Host name must be 150 characters or less'
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

// --- Location cascade ---
const provinceOptions = computed(() =>
  props.options.provinces.map(p => ({ value: p.id, label: p.name }))
)
const districtOptions = computed(() =>
  districts.value.map(d => ({ value: d.id, label: d.name }))
)
const communeOptions = computed(() =>
  communes.value.map(c => ({ value: c.id, label: c.name }))
)
const villageOptions = computed(() =>
  villages.value.map(v => ({ value: v.id, label: v.name }))
)

watch(() => props.modelValue.province_id, async (id) => {
  districts.value = []
  communes.value = []
  villages.value = []
  if (id) {
    try {
      districts.value = await fetchDistricts(id)
      console.log(`Loaded ${districts.value.length} districts for province ${id}`)
    } catch (e) {
      console.error('Failed to load districts:', e)
    }
  }
}, { immediate: true })

watch(() => props.modelValue.district_id, async (id) => {
  communes.value = []
  villages.value = []
  if (id) {
    try {
      communes.value = await fetchCommunes(id)
      console.log(`Loaded ${communes.value.length} communes for district ${id}`)
    } catch (e) {
      console.error('Failed to load communes:', e)
    }
  }
}, { immediate: true })

watch(() => props.modelValue.commune_id, async (id) => {
  villages.value = []
  if (id) {
    try {
      villages.value = await fetchVillages(id)
      console.log(`Loaded ${villages.value.length} villages for commune ${id}`)
    } catch (e) {
      console.error('Failed to load villages:', e)
    }
  }
}, { immediate: true })

function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function onProvinceChange(v: number) {
  markTouched('province_id')
  emit('update:modelValue', { ...props.modelValue, province_id: v, district_id: null, commune_id: null, village_id: null })
}
function onDistrictChange(v: number) {
  markTouched('district_id')
  emit('update:modelValue', { ...props.modelValue, district_id: v, commune_id: null, village_id: null })
}
function onCommuneChange(v: number) {
  markTouched('commune_id')
  emit('update:modelValue', { ...props.modelValue, commune_id: v, village_id: null })
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

    <!-- Date and Time -->
    <div class="grid grid-cols-2 gap-4">
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
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">TIME *</label>
        <input
          type="time"
          :value="modelValue.time"
          :class="inputClasses('time')"
          @change="update('time', ($event.target as HTMLInputElement).value)"
          @blur="markTouched('time')"
        />
        <p v-if="hasError('time')" class="mt-1 text-xs text-red-500">{{ fieldError('time') }}</p>
      </div>
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

    <!-- Commune and Village -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">COMMUNE</label>
        <BaseSelect
          :model-value="modelValue.commune_id ?? ''"
          :options="communeOptions"
          placeholder="Commune"
          :disabled="!modelValue.district_id"
          @update:model-value="(v: string | number) => onCommuneChange(Number(v))"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">VILLAGE *</label>
        <div :class="hasError('village_id') ? 'base-select-error' : ''">
          <BaseSelect
            :model-value="modelValue.village_id ?? ''"
            :options="villageOptions"
            placeholder="Village"
            :disabled="!modelValue.commune_id"
            @update:model-value="(v: string | number) => { markTouched('village_id'); update('village_id', Number(v)) }"
          />
        </div>
        <p v-if="hasError('village_id')" class="mt-1 text-xs text-red-500">{{ fieldError('village_id') }}</p>
      </div>
    </div>

    <!-- School and Host By -->
    <div class="grid grid-cols-2 gap-4">
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
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">HOST BY *</label>
        <input
          type="text"
          :value="modelValue.hostBy"
          :class="inputClasses('hostBy')"
          @input="update('hostBy', ($event.target as HTMLInputElement).value)"
          @blur="markTouched('hostBy')"
          placeholder="Enter host name"
        />
        <p v-if="hasError('hostBy')" class="mt-1 text-xs text-red-500">{{ fieldError('hostBy') }}</p>
      </div>
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
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PARTNER / OFFICER</label>
      <div class="flex items-center gap-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="partnerType"
            value="NGO"
            :checked="modelValue.partnerType === 'NGO'"
            @change="update('partnerType', 'NGO')"
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
            @change="update('partnerType', 'Officer')"
            class="accent-blue-600"
          />
          <span class="text-sm text-slate-700">Officer</span>
        </label>
      </div>
      <input
        v-if="modelValue.partnerType === 'NGO'"
        type="text"
        :value="modelValue.ngoName"
        :class="inputClasses('ngoName')"
        @input="update('ngoName', ($event.target as HTMLInputElement).value)"
        @blur="markTouched('ngoName')"
        placeholder="Enter NGO name"
      />
      <p v-if="hasError('ngoName')" class="mt-1 text-xs text-red-500">{{ fieldError('ngoName') }}</p>
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
