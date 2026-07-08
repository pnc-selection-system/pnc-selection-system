<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import DashboardCard from '../components/DashboardCard.vue'
import DashboardFilter from '../components/DashboardFilter.vue'
import DashboardSkeleton from '../components/DashboardSkeleton.vue'
import FunnelChart from '../components/FunnelChart.vue'
import OutcomeSplitChart from '../components/OutcomeSplitChart.vue'
import ProvinceChart from '../components/ProvinceChart.vue'
import YearChart from '../components/YearChart.vue'
import { fetchDashboardData, fetchFilterOptions } from '../service/service.ts'
import type { DashboardData } from '../types/dashboard.ts'
import { DEFAULT_FILTERS, type DashboardFilters, type FilterOptions } from '../types/filter.ts'

const loading = ref(true)
const filters = ref<DashboardFilters>({ ...DEFAULT_FILTERS })
const filterOptions = ref<FilterOptions>({ campaigns: [], provinces: [], statuses: [] })
const data = ref<DashboardData | null>(null)

async function loadData() {
  loading.value = true
  data.value = await fetchDashboardData(filters.value)
  loading.value = false
}

function handleExport() {
  if (!data.value) return
  const blob = new Blob([JSON.stringify(data.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `dashboard-export-${filters.value.campaign}.json`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  filterOptions.value = await fetchFilterOptions()
  await loadData()
})

watch(filters, loadData, { deep: true })
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="mx-auto max-w-6xl space-y-4">
      <DashboardFilter v-model="filters" :options="filterOptions" @export="handleExport" />

      <DashboardSkeleton v-if="loading" />

      <template v-else-if="data">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            v-for="stat in data.stats"
            :key="stat.key"
            :label="stat.label"
            :value="stat.value"
            :delta="stat.delta"
            :variant="stat.key === 'selected' ? 'blue' : 'white'"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <FunnelChart :stages="data.funnel" />
          </div>
          <OutcomeSplitChart :data="data.outcome" />
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ProvinceChart :data="data.provinces" />
          <YearChart :data="data.yearOverYear" :tag="data.yearOverYearTag" />
        </div>
      </template>
    </div>
  </div>
</template>