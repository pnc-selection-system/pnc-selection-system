<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ReportFormPanel from '../components/ReportFormPanel.vue'
import RecentReportsTable from '../components/RecentReportsTable.vue'
import { fetchReports, generateReport, downloadReport } from '../services/reportExport'
import type { Report, GenerateReportPayload } from '../types'

const meta = {
  breadcrumb: ['DECISION', 'REPORTS & EXPORTS'],
  title: 'Reports & exports',
  roles: ['Officer', 'Manager'],
}

const reports = ref<Report[]>([])
const isLoading = ref(false)
const isGenerating = ref(false)

async function loadReports() {
  isLoading.value = true
  try {
    reports.value = await fetchReports()
  } catch (error) {
    console.error('Failed to load reports:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleGenerate(payload: GenerateReportPayload) {
  isGenerating.value = true
  try {
    const newReport = await generateReport(payload)
    reports.value = [newReport, ...reports.value]
  } catch (error) {
    console.error('Failed to generate report:', error)
  } finally {
    isGenerating.value = false
  }
}

async function handleDownload(id: string) {
  try {
    await downloadReport(id)
  } catch (error) {
    console.error('Failed to download report:', error)
  }
}

onMounted(() => {
  loadReports()
})
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-6">
      <!-- Page Header -->
      <div>
        <nav class="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <template v-for="(item, index) in meta.breadcrumb" :key="index">
            <span>{{ item }}</span>
            <span v-if="index < meta.breadcrumb.length - 1">/</span>
          </template>
        </nav>
        <h1 class="text-2xl font-bold text-slate-900">{{ meta.title }}</h1>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportFormPanel
          :loading="isGenerating"
          @generate="handleGenerate"
        />
        <RecentReportsTable
          :reports="reports"
          @download="handleDownload"
        />
      </div>
    </div>
  </div>
</template>
