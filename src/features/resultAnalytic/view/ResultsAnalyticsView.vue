<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ToolbarActions from '../components/ToolbarActions.vue'
import ScoreDistributionChart from '../components/ScoreDistributionChart.vue'
import SummaryPanel from '../components/SummaryPanel.vue'
import ResultsTable from '../components/ResultsTable.vue'
import PublishLockDialog from '../components/PublishLockDialog.vue'
import { useResultsStore } from '../store/useResultsStore'
import {
  exportResults,
  fetchProvinces,
  fetchResultsTable,
  fetchRounds,
  fetchScoreDistribution,
  fetchSummary,
} from '../service/service'
import type { CandidateResultRow } from '../types/candidate'
import type { ExamRound, ScoreDistribution, SummaryStats } from '../types/results'

const CACHE_KEY = 'pnc_results_data'

interface ResultsCache {
  rounds: ExamRound[]
  provinces: string[]
  selectedProvince: string
  summary: SummaryStats
  distribution: ScoreDistribution
  rows: CandidateResultRow[]
}

function loadCache(): ResultsCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as ResultsCache) : null
  } catch {
    return null
  }
}

function saveCache(data: ResultsCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // silently ignore
  }
}

const cached = loadCache()

const store = useResultsStore()

const rounds = ref<ExamRound[]>(cached?.rounds ?? [])
const provinces = ref<string[]>(cached?.provinces ?? [])
const selectedProvince = ref<string>(cached?.selectedProvince ?? 'All provinces')

const summary = ref<SummaryStats>(
  cached?.summary ?? { satExam: 0, passed: 0, failed: 0, passRate: 0 },
)
const distribution = ref<ScoreDistribution>(
  cached?.distribution ?? { buckets: [], avg: 0, median: 0, passLine: 0 },
)
const rows = ref<CandidateResultRow[]>(cached?.rows ?? [])

const isPublishDialogOpen = ref(false)
const currentRoundLabel = computed(
  () => rounds.value.find((r) => r.id === store.currentRoundId)?.label ?? '',
)

/** Convert current round ID to numeric campaign ID for API calls */
function getCampaignId(): number {
  const id = parseInt(store.currentRoundId, 10)
  return isNaN(id) ? 0 : id
}

async function loadAllData() {
  const campaignId = getCampaignId()
  if (!campaignId) return

  const [provincesData, summaryData, distributionData, tableData] = await Promise.all([
    fetchProvinces(campaignId),
    fetchSummary(campaignId),
    fetchScoreDistribution(campaignId, selectedProvince.value),
    fetchResultsTable(campaignId),
  ])
  provinces.value = provincesData
  summary.value = summaryData
  distribution.value = distributionData
  rows.value = tableData
  saveCache({
    rounds: rounds.value,
    provinces: provinces.value,
    selectedProvince: selectedProvince.value,
    summary: summary.value,
    distribution: distribution.value,
    rows: rows.value,
  })
}

async function loadDistributionData() {
  const campaignId = getCampaignId()
  if (!campaignId) return

  distribution.value = await fetchScoreDistribution(campaignId, selectedProvince.value)
  saveCache({
    rounds: rounds.value,
    provinces: provinces.value,
    selectedProvince: selectedProvince.value,
    summary: summary.value,
    distribution: distribution.value,
    rows: rows.value,
  })
}

async function handleExport() {
  await exportResults(store.currentRoundId, rows.value)
}

async function handleConfirmPublish() {
  await store.publishAndLock()
  isPublishDialogOpen.value = false
}

onMounted(async () => {
  const roundsData = await fetchRounds()
  rounds.value = roundsData

  // Auto-select first round if none selected
  if (roundsData.length > 0 && !store.currentRoundId) {
    store.setRound(roundsData[0].id)
  }

  // Only load data if we have a valid campaign
  const campaignId = getCampaignId()
  if (!campaignId) return

  const [provincesData, summaryData, distributionData, tableData] = await Promise.all([
    fetchProvinces(campaignId),
    fetchSummary(campaignId),
    fetchScoreDistribution(campaignId, selectedProvince.value),
    fetchResultsTable(campaignId),
  ])
  provinces.value = provincesData
  summary.value = summaryData
  distribution.value = distributionData
  rows.value = tableData
  saveCache({
    rounds: rounds.value,
    provinces: provinces.value,
    selectedProvince: selectedProvince.value,
    summary: summary.value,
    distribution: distribution.value,
    rows: rows.value,
  })
})

watch(() => store.currentRoundId, async () => {
  if (store.currentRoundId) {
    await loadAllData()
  }
})

watch(selectedProvince, async () => {
  if (store.currentRoundId) {
    await loadDistributionData()
  }
})
</script>

<template>
  <div class="min-h-screen px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
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
