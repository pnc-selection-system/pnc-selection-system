<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatisticCard from '../../components/StatisticCard.vue'
import LoadingSkeleton from '../../components/LoadingSkeleton.vue'
import EmptyState from '../../components/EmptyState.vue'
import StatusBadge from '../../components/StatusBadge.vue'
import {
  fetchDashboardStats,
  fetchInvestigations,
  fetchChartData,
  fetchInvestigatorWorkload,
} from '../../service/investigationService'
import type { Investigation, ChartData, InvestigatorWorkload } from '../../types/investigation'

const loading = ref(true)
const stats = ref({
  pending: 0,
  inProgress: 0,
  submitted: 0,
  approved: 0,
  rejected: 0,
  total: 0,
})
const recentInvestigations = ref<Investigation[]>([])
const chartData = ref<ChartData[]>([])
const workload = ref<InvestigatorWorkload[]>([])

onMounted(async () => {
  try {
    stats.value = await fetchDashboardStats()
    const result = await fetchInvestigations(undefined, { page: 1, pageSize: 5 })
    recentInvestigations.value = result.data
    chartData.value = await fetchChartData()
    workload.value = await fetchInvestigatorWorkload()
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    loading.value = false
  }
})

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-600">Overview of home investigations</p>
    </div>

    <LoadingSkeleton v-if="loading" type="card" />

    <div v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatisticCard title="Pending" :value="stats.pending" color="slate" icon="⏳" />
        <StatisticCard title="In Progress" :value="stats.inProgress" color="blue" icon="🔄" />
        <StatisticCard title="Submitted" :value="stats.submitted" color="orange" icon="📤" />
        <StatisticCard title="Approved" :value="stats.approved" color="green" icon="✓" />
        <StatisticCard title="Rejected" :value="stats.rejected" color="red" icon="✗" />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Recent Investigations</h2>
          <div v-if="recentInvestigations.length === 0">
            <EmptyState title="No investigations yet" description="Create your first investigation to get started." />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Candidate</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Campaign</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Investigator</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Scheduled</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="investigation in recentInvestigations" :key="investigation.id" class="hover:bg-slate-50">
                  <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ investigation.candidateName }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ investigation.campaign }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ investigation.investigatorName || '-' }}</td>
                  <td class="px-4 py-3">
                    <StatusBadge :status="investigation.status" />
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(investigation.scheduledDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-lg border border-slate-200 bg-white p-6">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Investigation by Month</h2>
            <div class="space-y-3">
              <div v-for="item in chartData" :key="item.month" class="flex items-center gap-3">
                <div class="w-12 text-sm text-slate-600">{{ item.month }}</div>
                <div class="flex-1">
                  <div class="h-2 rounded-full bg-slate-100">
                    <div
                      class="h-2 rounded-full bg-blue-600"
                      :style="{ width: `${(item.count / 25) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="w-8 text-sm font-medium text-slate-700">{{ item.count }}</div>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 bg-white p-6">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Investigator Workload</h2>
            <div class="space-y-3">
              <div v-for="item in workload" :key="item.investigatorId" class="flex items-center justify-between">
                <div class="text-sm font-medium text-slate-700">{{ item.investigatorName }}</div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-500">{{ item.total }} total</span>
                  <span class="text-xs text-orange-600">{{ item.submitted }} pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>