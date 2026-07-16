<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="w-36">
      <el-select
        v-model="localProvinceId"
        placeholder="Province"
        size="small"
        class="filter-select"
        :loading="loadingOptions"
        @change="emitFilter()"
      >
        <el-option :value="null" label="All" />
        <el-option
          v-for="p in provinces"
          :key="p.id"
          :value="p.id"
          :label="p.name"
        />
      </el-select>
    </div>
    <div class="w-36">
      <el-select
        v-model="localNgoId"
        placeholder="NGO"
        size="small"
        class="filter-select"
        :loading="loadingOptions"
        @change="emitFilter()"
      >
        <el-option :value="null" label="All" />
        <el-option
          v-for="n in ngos"
          :key="n.id"
          :value="n.id"
          :label="n.name"
        />
      </el-select>
    </div>
    <div class="w-36">
      <el-select
        v-model="localStatus"
        placeholder="Status"
        size="small"
        class="filter-select"
        @change="emitFilter()"
      >
        <el-option value="" label="All" />
        <el-option value="Register" label="Register" />
        <el-option value="Investigating" label="Investigating" />
        <el-option value="Assessed" label="Assessed" />
        <el-option value="Approved" label="Approved" />
        <el-option value="Rejected" label="Rejected" />
        <el-option value="On Hold" label="On Hold" />
      </el-select>
    </div>
    <div class="w-36">
      <el-select
        v-model="localExamResult"
        placeholder="Result"
        size="small"
        class="filter-select"
        @change="emitFilter()"
      >
        <el-option value="" label="All" />
        <el-option value="Pass" label="Pass" />
        <el-option value="Fail" label="Fail" />
      </el-select>
    </div>
    <button
      class="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition font-medium"
      @click="resetFilters"
    >
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchProvinces } from '../services/provinceService'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import type { ProvinceData } from '../services/provinceService'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

const emit = defineEmits<{
  filter: [{ province_id: number | null; ngo_id: number | null; status: string; examResult: string }]
}>()

const provinces = ref<ProvinceData[]>([])
const ngos = ref<NgoPartner[]>([])
const loadingOptions = ref(false)

const localProvinceId = ref<number | null>(null)
const localNgoId = ref<number | null>(null)
const localStatus = ref('')
const localExamResult = ref('')

async function loadOptions() {
  if (provinces.value.length > 0) return
  loadingOptions.value = true
  try {
    const [provinceData, ngoData] = await Promise.all([
      fetchProvinces(),
      fetchPartners(),
    ])
    provinces.value = provinceData
    ngos.value = ngoData
  } catch {
    // Silently fail
  } finally {
    loadingOptions.value = false
  }
}

onMounted(loadOptions)

function emitFilter() {
  emit('filter', {
    province_id: localProvinceId.value,
    ngo_id: localNgoId.value,
    status: localStatus.value,
    examResult: localExamResult.value,
  })
}

function resetFilters() {
  localProvinceId.value = null
  localNgoId.value = null
  localStatus.value = ''
  localExamResult.value = ''
  emitFilter()
}
</script>

<style scoped>
.filter-select {
  width: 100%;
}
.filter-select :deep(.el-select__wrapper) {
  min-height: 30px;
  padding: 0 8px;
  font-size: 11px;
  box-shadow: 0 0 0 1px #d1d5db inset;
  border-radius: 4px;
}
.filter-select :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #93c5fd inset;
}
.filter-select :deep(.el-select__selected-item) {
  font-size: 11px;
  color: #334155;
}
</style>
