<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
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
        :loading="loading"
        @update-status="handleStatusUpdate"
      />
      <BasePagination
        :current-page="page"
        :total="total"
        :page-size="10"
        @update:current-page="setPage"
      />
    </div>

    <!-- Modals -->
    <CandidateFormModal
      v-model="showFormModal"
      @save="handleSaveCandidate"
    />
    <BulkImportModal
      v-model="showImportModal"
      @import="handleImportCandidates"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCandidates } from '../composables/useCandidates'
import { useCandidateStore } from '../stores/candidateStore'
import CandidateHeader from '../components/CandidateHeader.vue'
import CandidateSearch from '../components/CandidateSearch.vue'
import CandidateFilter from '../components/CandidateFilter.vue'
import CandidateTable from '../components/CandidateTable.vue'
import CandidateFormModal from '../components/CandidateFormModal.vue'
import BulkImportModal from '../components/BulkImportModal.vue'
import BasePagination from '@/components/base/BasePagination.vue'

const { candidates, loading, page, total, search, province_id, ngo_id, status, examResult, fetch, setPage } = useCandidates()
const store = useCandidateStore()

const showFormModal = ref(false)
const showImportModal = ref(false)

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

function handleStatusUpdate({ id, status }: { id: number; status: string }) {
  store.updateCandidateStatus(id, status)
}

async function handleImportCandidates(newCandidates: any[]) {
  try {
    await store.importCandidates(newCandidates as any)
    showImportModal.value = false
  } catch {
    // Error is handled in the store
  }
}

onMounted(fetch)
</script>
