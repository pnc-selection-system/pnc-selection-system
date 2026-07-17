<script setup lang="ts">
import { onMounted, ref } from "vue";
import DashboardCard from "../components/DashboardCard.vue";
import DashboardFilter from "../components/DashboardFilter.vue";
import FunnelChart from "../components/FunnelChart.vue";
import OutcomeSplitChart from "../components/OutcomeSplitChart.vue";
import ProvinceChart from "../components/ProvinceChart.vue";
import YearChart from "../components/YearChart.vue";
import { fetchDashboardData, fetchFilterOptions } from "../service/service.ts";
import type { DashboardData } from "../types/dashboard.ts";
import { DEFAULT_FILTERS, type DashboardFilters, type FilterOptions } from "../types/filter.ts";
import { useDebouncedWatch } from '@/utils/useDebouncedWatch'

const filters = ref<DashboardFilters>({ ...DEFAULT_FILTERS });
const filterOptions = ref<FilterOptions>({ campaigns: [], provinces: [], statuses: [] });
const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<DashboardData>({
  stats: [],
  funnel: [],
  outcome: { pass: 0, fail: 0, pending: 0 },
  provinces: [],
  yearOverYear: [],
});

async function loadData() {
  loading.value = true
  error.value = null
  try {
    data.value = await fetchDashboardData(filters.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard data'
    console.error('Dashboard data fetch failed:', err)
  } finally {
    loading.value = false
  }
}

function handleExport() {
  if (!data.value) return;
  const blob = new Blob([JSON.stringify(data.value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dashboard-export-${filters.value.campaign}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

onMounted(async () => {
  try {
    const [opts] = await Promise.all([fetchFilterOptions(), loadData()]);
    filterOptions.value = opts;
  } catch (err) {
    console.error('Failed to load initial dashboard data:', err)
  }
});

useDebouncedWatch(filters, loadData, 400, true)
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader breadcrumb="Home / Dashboard" title="Dashboard" />

      <DashboardFilter v-model="filters" :options="filterOptions" @export="handleExport" />

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
        <YearChart :data="data.yearOverYear" :tag="data.yearOverYearTag || ''" />
      </div>
    </div>
  </div>
</template>
