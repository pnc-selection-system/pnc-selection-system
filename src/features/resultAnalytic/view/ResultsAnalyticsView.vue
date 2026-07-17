<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ToolbarActions from '../components/ToolbarActions.vue'
import ScoreDistributionChart from '../components/ScoreDistributionChart.vue'
import SummaryPanel from '../components/SummaryPanel.vue'
import ResultsTable from '../components/ResultsTable.vue'
import PublishLockDialog from '../components/PublishLockDialog.vue'
import { useResultsStore } from '../store/useResultsStore'
import {
  exportResults,
  fetchPageMeta,
  fetchProvinces,
  fetchResultsTable,
  fetchRounds,
  fetchScoreDistribution,
  fetchSummary,
} from '../service/service'
import type { CandidateResultRow } from '../types/candidate'
import type { ExamRound, PageMeta, ScoreDistribution, SummaryStats } from '../types/results'

const store = useResultsStore()

const meta = ref<PageMeta>({
  breadcrumb: ['Exam', 'Results & Analytics'],
  title: 'Results & analytics',
  roles: [],
  reqRange: ['', ''],
})
const rounds = ref<ExamRound[]>([])
const provinces = ref<string[]>([])
const selectedProvince = ref('All provinces')

const summary = ref<SummaryStats>({ satExam: 0, passed: 0, failed: 0, passRate: 0 })
const distribution = ref<ScoreDistribution>({
  buckets: [],
  avg: 0,
  median: 0,
  passLine: 0,
})
const rows = ref<CandidateResultRow[]>([])

const isPublishDialogOpen = ref(false)
const currentRoundLabel = computed(
  () => rounds.value.find((r) => r.id === store.currentRoundId)?.label ?? '',
)

async function loadRoundData() {
  const [summaryData, distributionData, tableData] = await Promise.all([
    fetchSummary(store.currentRoundId),
    fetchScoreDistribution(store.currentRoundId, selectedProvince.value),
    fetchResultsTable(store.currentRoundId),
  ])
  summary.value = summaryData
  distribution.value = distributionData
  rows.value = tableData
}

async function handleExport() {
  await exportResults(store.currentRoundId, rows.value)
}

async function handleConfirmPublish() {
  await store.publishAndLock()
  isPublishDialogOpen.value = false
}

onMounted(async () => {
  const [m, r, p] = await Promise.all([
    fetchPageMeta(),
    fetchRounds(),
    fetchProvinces(),
  ])
  meta.value = m
  rounds.value = r
  provinces.value = p
  await loadRoundData()
})
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader :meta="meta" />

      <ToolbarActions
        :rounds="rounds"
        :model-value="store.currentRoundId"
        :status="store.currentStatus"
        @update:model-value="store.setRound"
        @export="handleExport"
        @publish-lock="isPublishDialogOpen = true"
      />

      <div class="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
        <ScoreDistributionChart
          :distribution="distribution"
          :provinces="provinces"
          v-model="selectedProvince"
        />
        <SummaryPanel :summary="summary" />
      </div>

      <ResultsTable :rows="rows" />
    </div>

    <PublishLockDialog
      v-model:open="isPublishDialogOpen"
      :round-label="currentRoundLabel"
      @confirm="handleConfirmPublish"
    />
  </div>
</template>