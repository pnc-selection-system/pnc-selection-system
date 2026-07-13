<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <CandidateHeader
        @create="showFormModal = true"
        @import="showImportModal = true"
      />

      <div class="flex flex-col gap-3">
        <CandidateSearch v-model="search" />
        <CandidateFilter @filter="onFilter" />
      </div>

      <CandidateTable :candidates="candidates" :loading="loading" />
      <BasePagination
        :current-page="page"
        :total="total"
        :page-size="10"
        @update:current-page="setPage"
      />
    </div>

    <!-- Modals -->
    <CandidateFormModal
      :visible="showFormModal"
      @close="showFormModal = false"
      @save="handleSaveCandidate"
    />
    <BulkImportModal
      :visible="showImportModal"
      @close="showImportModal = false"
      @import="handleImportCandidates"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCandidates } from '../composables/useCandidates'
import { useCandidateStore } from '../stores/candidateStore'
import type { Candidate } from '../types/index'
import CandidateHeader from '../components/CandidateHeader.vue'
import CandidateSearch from '../components/CandidateSearch.vue'
import CandidateFilter from '../components/CandidateFilter.vue'
import CandidateTable from '../components/CandidateTable.vue'
import CandidateFormModal from '../components/CandidateFormModal.vue'
import BulkImportModal from '../components/BulkImportModal.vue'
import BasePagination from '@/components/base/BasePagination.vue'

const { candidates, loading, page, total, search, province, ngo, status, examResult, fetch, setPage } = useCandidates()
const store = useCandidateStore()

const showFormModal = ref(false)
const showImportModal = ref(false)

const onFilter = (filters: { province: string; ngo: string; status: string; examResult: string }) => {
  province.value = filters.province
  ngo.value = filters.ngo
  status.value = filters.status
  examResult.value = filters.examResult
}

function handleSaveCandidate(candidate: Omit<Candidate, 'id'>) {
  store.addCandidate({
    name: candidate.fullName,
    province: candidate.province,
    ngo: candidate.organization || '',
  })
  showFormModal.value = false
}

function handleImportCandidates(newCandidates: Omit<Candidate, 'id'>[]) {
  store.importCandidates(
    newCandidates.map(c => ({
      name: c.fullName,
      province: c.province,
      ngo: c.organization || '',
    })),
  )
  showImportModal.value = false
}

onMounted(fetch)
</script>
