<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { fetchDistricts } from '../service/service'
import type { LocationOption } from '../types/filter'

const props = defineProps<{
  provinceId: number | null
  districtId: number | null
  provinces: LocationOption[]
}>()

const emit = defineEmits<{
  'update:provinceId': [value: number | null]
  'update:districtId': [value: number | null]
}>()

const districtList = ref<LocationOption[]>([])

watch(() => props.provinceId, async (id) => {
  districtList.value = []
  if (id) {
    try {
      districtList.value = await fetchDistricts(id)
    } catch (e) {
      console.error('Failed to load districts:', e)
    }
  }
}, { immediate: true })

function onProvinceChange(v: number | string | (string | number)[]) {
  const id = v ? Number(v) : null
  emit('update:provinceId', id)
  emit('update:districtId', null)
}

function onDistrictChange(v: number | string | (string | number)[]) {
  const id = v ? Number(v) : null
  emit('update:districtId', id)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PROVINCE</label>
      <el-select
        :model-value="provinceId"
        placeholder="Select Province"
        class="w-full"
        teleported
        popper-class="base-select-popper"
        @update:model-value="onProvinceChange"
      >
        <el-option
          v-for="p in provinces"
          :key="p.id"
          :value="Number(p.id)"
          :label="p.name"
        />
      </el-select>
    </div>
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DISTRICT</label>
      <el-select
        :model-value="districtId"
        placeholder="Select District"
        class="w-full"
        :disabled="!provinceId"
        teleported
        popper-class="base-select-popper"
        @update:model-value="onDistrictChange"
      >
        <el-option
          v-for="d in districtList"
          :key="d.id"
          :value="Number(d.id)"
          :label="d.name"
        />
      </el-select>
    </div>
  </div>
</template>
