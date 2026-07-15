<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
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

const isFormValid = computed(() => {
  const d = props.modelValue
  // For new records, require all fields. For existing records, only require essential fields
  const isNew = !d.id
  if (isNew) {
    return !!(
      d.campaign_id &&
      d.date?.trim() &&
      d.time?.trim() &&
      d.village_id &&
      d.school?.trim()
    )
  } else {
    // For existing records, be more lenient - just require campaign, date, time, and school
    return !!(
      d.campaign_id &&
      d.date?.trim() &&
      d.time?.trim() &&
      d.school?.trim()
    )
  }
})

function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function onProvinceChange(v: number) {
  emit('update:modelValue', { ...props.modelValue, province_id: v, district_id: null, commune_id: null, village_id: null })
}
function onDistrictChange(v: number) {
  emit('update:modelValue', { ...props.modelValue, district_id: v, commune_id: null, village_id: null })
}
function onCommuneChange(v: number) {
  emit('update:modelValue', { ...props.modelValue, commune_id: v, village_id: null })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Campaign -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">CAMPAIGN *</label>
      <BaseSelect
        :model-value="modelValue.campaign_id ?? ''"
        :options="(campaigns || []).map(c => ({ value: c.id, label: `${c.name} (${c.year})` }))"
        placeholder="Select campaign"
        @update:model-value="(v: string | number) => update('campaign_id', Number(v))"
      />
      <p v-if="errors?.campaign_id" class="mt-1 text-xs text-red-500">{{ errors.campaign_id }}</p>
    </div>

    <!-- Date and Time -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DATE *</label>
        <input
          type="date"
          :value="modelValue.date"
          @change="update('date', ($event.target as HTMLInputElement).value)"
          class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <p v-if="errors?.date" class="mt-1 text-xs text-red-500">{{ errors.date }}</p>
      </div>
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">TIME *</label>
        <input
          type="time"
          :value="modelValue.time"
          @change="update('time', ($event.target as HTMLInputElement).value)"
          class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <p v-if="errors?.time" class="mt-1 text-xs text-red-500">{{ errors.time }}</p>
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
        <BaseSelect
          :model-value="modelValue.village_id ?? ''"
          :options="villageOptions"
          placeholder="Village"
          :disabled="!modelValue.commune_id"
          @update:model-value="(v: string | number) => update('village_id', Number(v))"
        />
        <p v-if="errors?.village_id" class="mt-1 text-xs text-red-500">{{ errors.village_id }}</p>
      </div>
    </div>

    <!-- School -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SCHOOL *</label>
      <input
        type="text"
        :value="modelValue.school"
        @input="update('school', ($event.target as HTMLInputElement).value)"
        placeholder="Enter school name"
        class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <p v-if="errors?.school" class="mt-1 text-xs text-red-500">{{ errors.school }}</p>
    </div>

    <!-- Attendance -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ATTENDANCE COUNT</label>
        <BaseInput
          type="number"
          :model-value="String(modelValue.attendanceCount)"
          @update:model-value="(v: string) => update('attendanceCount', Number(v))"
          placeholder="0"
        />
      </div>
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">EXPECTED ATTENDANCE</label>
        <BaseInput
          type="number"
          :model-value="String(modelValue.expectedAttendance)"
          @update:model-value="(v: string) => update('expectedAttendance', Number(v))"
          placeholder="0"
        />
        <p v-if="errors?.expectedAttendance" class="mt-1 text-xs text-red-500">{{ errors.expectedAttendance }}</p>
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
      <BaseInput
        v-if="modelValue.partnerType === 'NGO'"
        :model-value="modelValue.ngoName"
        @update:model-value="(v: string) => update('ngoName', v)"
        placeholder="Enter NGO name"
      />
      <p v-if="errors?.ngoName" class="mt-1 text-xs text-red-500">{{ errors.ngoName }}</p>
    </div>

    <!-- Host By -->
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">HOST BY</label>
      <BaseInput
        :model-value="modelValue.hostBy"
        @update:model-value="(v: string) => update('hostBy', v)"
        placeholder="Enter host name"
      />
      <p v-if="errors?.hostBy" class="mt-1 text-xs text-red-500">{{ errors.hostBy }}</p>
    </div>

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
        :disabled="!isFormValid || isSaving"
        :loading="isSaving"
        @click="emit('save')"
      >
        {{ isSaving ? 'Saving...' : 'Save session' }}
      </BaseButton>
    </div>
  </div>
</template>
