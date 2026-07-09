<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ToolbarActions from '../components/ToolbarActions.vue'
import ScoreDistributionChart from '../components/ScoreDistributionChart.vue'
import SummaryPanel from '../components/SummaryPanel.vue'
import ResultsTable from '../components/ResultsTable.vue'
import PublishLockDialog from '../components/PublishLockDialog.vue'
import ResultsAnalyticsSkeleton from '../components/ResultsAnalyticsSkeleton.vue'
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

const loading = ref(true)
const meta = ref<PageMeta | null>(null)
const rounds = ref<ExamRound[]>([])
const provinces = ref<string[]>([])
const selectedProvince = ref('All provinces')

const summary = ref<SummaryStats | null>(null)
const distribution = ref<ScoreDistribution | null>(null)
const rows = ref<CandidateResultRow[]>([])

const isPublishDialogOpen = ref(false)
const currentRoundLabel = computed(
  () => rounds.value.find((r) => r.id === store.currentRoundId)?.label ?? '',
)

async function loadRoundData() {
  loading.value = true
  const [summaryData, distributionData, tableData] = await Promise.all([
    fetchSummary(store.currentRoundId),
    fetchScoreDistribution(store.currentRoundId, selectedProvince.value),
    fetchResultsTable(store.currentRoundId),
  ])
  summary.value = summaryData
  distribution.value = distributionData
  rows.value = tableData
  loading.value = false
}

async function handleExport() {
  await exportResults(store.currentRoundId, rows.value)
}

async function handleConfirmPublish() {
  await store.publishAndLock()
  isPublishDialogOpen.value = false
}

onMounted(async () => {
  meta.value = await fetchPageMeta()
  rounds.value = await fetchRounds()
  provinces.value = await fetchProvinces()
  await loadRoundData()
})

watch([() => store.currentRoundId, selectedProvince], loadRoundData)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-6xl space-y-4">
      <ResultsAnalyticsSkeleton v-if="loading" />

      <template v-else>
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
            v-if="distribution"
            :distribution="distribution"
            :provinces="provinces"
            v-model="selectedProvince"
          />
          <SummaryPanel v-if="summary" :summary="summary" />
        </div>

        <ResultsTable :rows="rows" />
      </template>
    </div>

    <PublishLockDialog
      v-model:open="isPublishDialogOpen"
      :round-label="currentRoundLabel"
      @confirm="handleConfirmPublish"
    />
  </div>
</template>