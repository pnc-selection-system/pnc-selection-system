<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchCommunes, fetchDistricts, fetchProvinces, fetchVillages } from '../service/service'
import type { LocationSelection } from '../types/location'

const props = defineProps<{
  modelValue: LocationSelection
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationSelection]
}>()

const provinces = ref<string[]>([])
const districts = ref<string[]>([])
const communes = ref<string[]>([])
const villages = ref<string[]>([])

function update<K extends keyof LocationSelection>(key: K, value: LocationSelection[K]) {
  const next = { ...props.modelValue, [key]: value }
  // Selecting a higher level clears everything below it.
  if (key === 'province') {
    next.district = ''
    next.commune = ''
    next.village = ''
  } else if (key === 'district') {
    next.commune = ''
    next.village = ''
  } else if (key === 'commune') {
    next.village = ''
  }
  emit('update:modelValue', next)
}

watch(
  () => props.modelValue.province,
  async (province) => {
    districts.value = province ? await fetchDistricts(province) : []
  },
)

watch(
  () => props.modelValue.district,
  async (district) => {
    communes.value = district ? await fetchCommunes(district) : []
  },
)

watch(
  () => props.modelValue.commune,
  async (commune) => {
    villages.value = commune ? await fetchVillages(commune) : []
  },
)

onMounted(async () => {
  provinces.value = await fetchProvinces()
  if (props.modelValue.province) districts.value = await fetchDistricts(props.modelValue.province)
  if (props.modelValue.district) communes.value = await fetchCommunes(props.modelValue.district)
  if (props.modelValue.commune) villages.value = await fetchVillages(props.modelValue.commune)
})
</script>

<template>
  <div>
    <p class="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
        <path d="M10 18s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" stroke="currentColor" stroke-width="1.5" />
        <circle cx="10" cy="8" r="2" stroke="currentColor" stroke-width="1.5" />
      </svg>
      Location
    </p>

    <div class="mt-3 grid grid-cols-2 gap-4">
      <label class="block">
        <span class="text-xs font-medium text-slate-500">Province <span class="text-rose-400">*</span></span>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.province"
          @change="update('province', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Select province...</option>
          <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-xs font-medium text-slate-500">District</span>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          :value="modelValue.district"
          :disabled="!modelValue.province"
          @change="update('district', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Select district...</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-xs font-medium text-slate-500">Commune</span>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          :value="modelValue.commune"
          :disabled="!modelValue.district"
          @change="update('commune', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Select commune...</option>
          <option v-for="c in communes" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="block">
        <span class="text-xs font-medium text-slate-500">Village</span>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          :value="modelValue.village"
          :disabled="!modelValue.commune"
          @change="update('village', ($event.target as HTMLSelectElement).value)"
        >
          <option value="" disabled>Select village...</option>
          <option v-for="v in villages" :key="v" :value="v">{{ v }}</option>
        </select>
      </label>
    </div>
  </div>
</template>