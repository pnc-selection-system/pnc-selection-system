<template>
  <div class="min-h-screen bg-gray-50">
    <CandidateHeader />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="mb-6">
        <CandidateSearch v-model="search" />
      </div>

      <div class="flex gap-6">
        <div class="w-56 flex-shrink-0">
          <CandidateFilter @filter="onFilter" />
        </div>

        <div class="flex-1">
          <CandidateTable :candidates="candidates" :loading="loading" />
          <CandidatePagination :page="page" :totalPages="totalPages" @change="setPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCandidates } from '../composables/useCandidates'
import CandidateHeader from '../components/CandidateHeader.vue'
import CandidateSearch from '../components/CandidateSearch.vue'
import CandidateFilter from '../components/CandidateFilter.vue'
import CandidateTable from '../components/CandidateTable.vue'
import CandidatePagination from '../components/CandidatePagination.vue'

const { candidates, loading, page, totalPages, search, province, ngo, status, examResult, fetch, setPage } = useCandidates()

const onFilter = (filters: { province: string; ngo: string; status: string; examResult: string }) => {
  province.value = filters.province
  ngo.value = filters.ngo
  status.value = filters.status
  examResult.value = filters.examResult
}

onMounted(fetch)
</script>
