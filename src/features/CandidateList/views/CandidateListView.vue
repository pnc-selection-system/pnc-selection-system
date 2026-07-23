<template>
  <div>
    <div class="space-y-4">
      <CandidateHeader
        @create="showFormModal = true"
        @import="showImportModal = true"
      />

      <div v-if="store.error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {{ store.error }}
      </div>

      <div class="flex flex-col gap-3">
        <CandidateSearch v-model="search" />
        <CandidateFilter @filter="onFilter" />
      </div>

      <CandidateTable
        :candidates="candidates"
        :loading="showLoading"
        @row-click="handleRowClick"
      />

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4 text-xs text-slate-500">
          <div class="flex items-center gap-2">
            <span>Show</span>
            <el-select
              :model-value="perPage"
              size="small"
              class="per-page-select"
              @update:model-value="handlePerPageChange"
            >
              <el-option :value="10" label="10" />
              <el-option :value="20" label="20" />
              <el-option :value="50" label="50" />
            </el-select>
            <span>entries</span>
          </div>
          <span class="text-slate-400">{{ recordSummary }}</span>
        </div>

        <el-pagination
          v-model:current-page="page"
          :page-size="perPage"
          :total="total"
          size="small"
          background
          layout="prev, pager, next"
        />
      </div>
    </div>

    <!-- Modals -->
    <CandidateFormModal
      v-model="showFormModal"
      :saving="store.saving"
      :error="store.error"
      @save="handleSaveCandidate"
    />
    <BulkImportModal
      v-model="showImportModal"
      @imported="handleImportComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCandidates } from '../composables/useCandidates'
import { useCandidateStore } from '../stores/candidateStore'
import CandidateHeader from '../components/CandidateHeader.vue'
import CandidateSearch from '../components/CandidateSearch.vue'
import CandidateFilter from '../components/CandidateFilter.vue'
import CandidateTable from '../components/CandidateTable.vue'
import CandidateFormModal from '../components/CandidateFormModal.vue'
import BulkImportModal from '../components/BulkImportModal.vue'
import type { Candidate } from '../types/candidate'


const router = useRouter()
const { candidates, loading, page, total, totalPages, search, province_id, ngo_id, status, examResult, perPage } = useCandidates()
const store = useCandidateStore()

// Hydrate from sessionStorage before useCandidates immediately triggers applyFilters
store.hydrateFromStorage()

const showFormModal = ref(false)
const showImportModal = ref(false)

// Skip loading spinner on initial page load — show table immediately
// Data loads in background and appears when ready
const initialPageLoad = ref(true)
const showLoading = computed(() => !initialPageLoad.value && loading.value)

// End initial page load when the first fetch completes (data arrives or empty)
watch(loading, (newVal, oldVal) => {
  if (oldVal === true && newVal === false && initialPageLoad.value) {
    initialPageLoad.value = false
  }
})

// Also end initial page load on error
watch(() => store.error, (newVal) => {
  if (newVal && initialPageLoad.value) {
    initialPageLoad.value = false
  }
})

// Clear any stale error when opening the create form modal
watch(showFormModal, (val) => {
  if (val) store.error = null
})

const onFilter = (filters: { province_id: number | null; ngo_id: number | null; status: string; examResult: string }) => {
  province_id.value = filters.province_id
  ngo_id.value = filters.ngo_id
  status.value = filters.status
  examResult.value = filters.examResult
}

async function handleSaveCandidate(payload: {
  firstName: string
  lastName: string
  firstNameKH: string
  lastNameKH: string
  gender: 'Male' | 'Female'
  dateOfBirth: string
  phone: string
  province_id: number
  schoolName: string
  campaign_id: number | null
  ngo_id: number | null
  status: string
}) {
  try {
    await store.addCandidate(payload)
    showFormModal.value = false
  } catch {
    // Error is handled in the store
  }
}

function handleRowClick(row: Candidate) {
  router.push({ name: 'candidate-profile', params: { id: String(row.id) } })
}

const recordSummary = computed(() => {
  if (total.value === 0) return 'No entries'
  const from = (page.value - 1) * perPage.value + 1
  const to = Math.min(page.value * perPage.value, total.value)
  return `Showing ${from.toLocaleString()}-${to.toLocaleString()} of ${total.value.toLocaleString()} entries`
})

function handlePerPageChange(value: number) {
  store.setPerPage(value)
}

// Watch page changes (from pagination clicks via v-model) and fetch that page's data
watch(page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    store.fetchCandidates()
  }
})

function handleImportComplete() {
  showImportModal.value = false
  store.fetchCandidates()
}
</script>

<style scoped>
.per-page-select {
  width: 80px;
}
.per-page-select :deep(.el-select__wrapper) {
  min-height: 30px;
  padding: 0 8px;
  font-size: 11px;
  box-shadow: 0 0 0 1px #d1d5db inset;
  border-radius: 4px;
}
.per-page-select :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #93c5fd inset;
}
.per-page-select :deep(.el-select__selected-item) {
  font-size: 11px;
  color: #334155;
}

.el-pagination {
  --el-pagination-font-size: 12px;
  --el-pagination-button-width: 28px;
  --el-pagination-button-height: 28px;
  --el-pagination-border-radius: 4px;
  font-weight: 500;
}
</style>
