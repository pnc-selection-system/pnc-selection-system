<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCandidateList } from '../service/service'
import { statusConfigs } from '../types/index'
import type { CandidateStatus } from '../types/index'
import CandidateFilterPanel from '../components/CandidateFilterPanel.vue'
import CandidateFormModal from '../components/CandidateFormModal.vue'
import BulkImportModal from '../components/BulkImportModal.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

const router = useRouter()
const {
  filteredCandidates,
  paginatedCandidates,
  searchQuery,
  provinceFilter,
  ngoFilter,
  statusFilter,
  examResultFilter,
  showDuplicatesOnly,
  selectedIds,
  currentPage,
  totalPages,
  pageSize,
  provinces,
  ngos,
  addCandidate,
  importCandidates,
  toggleSelectAll,
  toggleSelect,
  applyFilters,
  goToPage,
} = useCandidateList()

const showFormModal = ref(false)
const showImportModal = ref(false)

function handleSaveCandidate(candidate: Parameters<typeof addCandidate>[0]) {
  addCandidate(candidate)
}

function viewProfile(id: string) {
  router.push({ name: 'candidate-profile', params: { id } })
}

function getStatusBadgeType(status: CandidateStatus) {
  switch (status) {
    case 'approved':
    case 'assessed':
      return 'success'
    case 'investigating':
      return 'warning'
    case 'rejected':
      return 'danger'
    case 'on_hold':
      return 'info'
    case 'exam_done':
      return 'warning'
    case 'registered':
      return 'info'
    default:
      return 'info'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 px-4 py-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1400px] py-4">
      <!-- Breadcrumb & Header -->
      <div class="mb-3">
        <div class="flex flex-col gap-0">
          <p class="text-[10px] font-semibold uppercase text-slate-500">CANDIDATES / LIST</p>
          <h1 class="text-[22px] font-semibold tracking-tight text-slate-900">Candidate list</h1>
        </div>
      </div>

      <!-- Info Banner -->
      <div
        class="mb-5 flex flex-wrap items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 px-5 py-2.5"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase text-amber-600">ROLES</span>
          <span class="text-sm text-slate-700">Officer · Manager (read: Committee)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase text-amber-600">REQS</span>
          <div class="flex gap-1">
            <span
              v-for="req in ['FR-CP-6', 'FR-CP-7', 'FR-CP-8']"
              :key="req"
              class="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600"
            >
              {{ req }}
            </span>
          </div>
        </div>
      </div>

      <!-- Search & Actions Row -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1">
          <BaseInput
            v-model="searchQuery"
            placeholder="Search by name, ID, school..."
          />
        </div>
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            @click="showImportModal = true"
          >
            <BaseIcon name="download" :size="16" />
            Bulk import
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            @click="showFormModal = true"
          >
            <BaseIcon name="plus" :size="16" :stroke-width="2.5" />
            New candidate
          </button>
        </div>
      </div>

      <!-- Main Content: Sidebar + Table -->
      <div class="flex gap-6">
        <!-- Left Sidebar Filters -->
        <CandidateFilterPanel
          :province-filter="provinceFilter"
          :ngo-filter="ngoFilter"
          :status-filter="statusFilter"
          :exam-result-filter="examResultFilter"
          :show-duplicates-only="showDuplicatesOnly"
          :provinces="provinces"
          :ngos="ngos"
          @update:province-filter="provinceFilter = $event"
          @update:ngo-filter="ngoFilter = $event"
          @update:status-filter="statusFilter = $event as CandidateStatus | 'all'"
          @update:exam-result-filter="examResultFilter = $event"
          @update:show-duplicates-only="showDuplicatesOnly = $event"
          @apply="applyFilters"
        />

        <!-- Table Content -->
        <div class="flex-1">
          <!-- Table Header -->
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm text-slate-500">
              <span class="font-semibold text-slate-700">{{ filteredCandidates.length }}</span> candidates
              · {{ pageSize }} / page
            </p>
            <div class="flex items-center gap-2">
              <button class="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                Save segment
              </button>
              <button class="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                Export
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table class="min-w-full text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 bg-slate-50">
                  <th class="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      :checked="selectedIds.length === paginatedCandidates.length && paginatedCandidates.length > 0"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
                    ID
                  </th>
                  <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
                    NAME
                  </th>
                  <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
                    PROVINCE
                  </th>
                  <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
                    NGO
                  </th>
                  <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
                    EXAM
                  </th>
                  <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="paginatedCandidates.length === 0">
                  <td colspan="7" class="px-4 py-12 text-center text-sm text-slate-500">
                    No candidates found
                  </td>
                </tr>
                <tr
                  v-for="candidate in paginatedCandidates"
                  :key="candidate.id"
                  class="cursor-pointer transition hover:bg-slate-50"
                  @click="viewProfile(candidate.id)"
                >
                  <td class="px-4 py-3" @click.stop>
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      :checked="selectedIds.includes(candidate.id)"
                      @change="toggleSelect(candidate.id)"
                    />
                  </td>
                  <td class="px-4 py-3 text-xs font-medium text-slate-900">
                    {{ candidate.candidateCode }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-medium text-slate-900">
                        {{ candidate.fullName.split(' ')[0] }} {{ candidate.fullName.split(' ').slice(1).map(n => n[0]).join('.') }}.
                      </span>
                      <span
                        v-if="candidate.isDuplicate"
                        class="rounded bg-amber-100 px-1.5 py-0.5 text-[0.6rem] font-medium text-amber-700"
                      >
                        dup?
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-xs text-slate-600">{{ candidate.province }}</td>
                  <td class="px-4 py-3 text-xs text-slate-600">
                    {{ candidate.organization || '—' }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      v-if="candidate.examResult"
                      class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
                      :class="{
                        'bg-green-50 text-green-700': candidate.examResult === 'pass',
                        'bg-red-50 text-red-700': candidate.examResult === 'fail',
                      }"
                    >
                      {{ candidate.examResult === 'pass' ? 'Pass' : 'Fail' }} · {{ candidate.examScore }}
                    </span>
                    <span v-else class="text-xs text-slate-400">—</span>
                  </td>
                  <td class="px-4 py-3">
                    <BaseBadge :type="getStatusBadgeType(candidate.status)" size="small">
                      {{ statusConfigs[candidate.status].label }}
                    </BaseBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm text-slate-500">
              Page <span class="font-medium text-slate-700">{{ currentPage }}</span> of
              <span class="font-medium text-slate-700">{{ totalPages || 1 }}</span>
            </p>
            <div class="flex items-center gap-2">
              <button
                class="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="currentPage <= 1"
                @click="goToPage(currentPage - 1)"
              >
                ‹ Prev
              </button>
              <button
                class="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="currentPage >= totalPages"
                @click="goToPage(currentPage + 1)"
              >
                Next ›
              </button>
            </div>
          </div>

          <!-- Info Box -->
          <div
            class="mt-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3"
          >
            <div class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
              <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-xs text-slate-600">
              Bulk import (CSV/XLSX) opens the same wizard pattern as exam import. Duplicate detection flags name + DOB + province matches for manual merge.
            </p>
          </div>
        </div>
      </div>
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
      @import="importCandidates"
    />
  </div>
</template>
