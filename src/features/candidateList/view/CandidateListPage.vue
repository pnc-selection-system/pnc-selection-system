<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCandidateList } from '../service/service'
import { statusConfigs } from '../types/index'
import type { CandidateStatus } from '../types/index'
import CandidateFilterPanel from '../components/CandidateFilterPanel.vue'
import CandidateFormModal from '../components/CandidateFormModal.vue'
import BulkImportModal from '../components/BulkImportModal.vue'

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
  saveSegment,
  exportCandidates,
} = useCandidateList()

const showFormModal = ref(false)
const showImportModal = ref(false)
const showSaveSegmentModal = ref(false)
const segmentName = ref('')

function handleSaveCandidate(candidate: Parameters<typeof addCandidate>[0]) {
  addCandidate(candidate)
}

function handleSaveSegment() {
  if (segmentName.value.trim()) {
    saveSegment(segmentName.value.trim())
    segmentName.value = ''
    showSaveSegmentModal.value = false
  }
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
      <PageHeader breadcrumb="CANDIDATES / LIST" title="Candidate list" class="mb-3" />

      <!-- Search & Actions Row -->
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1">
          <BaseInput
            v-model="searchQuery"
            placeholder="Search by name, ID, school..."
          />
        </div>
        <div class="flex items-center gap-3">
          <BaseButton
            variant="secondary"
            class="!w-auto"
            @click="showImportModal = true"
          >
            <BaseIcon :size="16">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </BaseIcon>
            Bulk import
          </BaseButton>
          <BaseButton @click="showFormModal = true" class="!w-auto">
            <BaseIcon :size="16" :stroke-width="2.5">
              <path d="M12 5v14M5 12h14" />
            </BaseIcon>
            New candidate
          </BaseButton>
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
              <BaseButton
                variant="secondary"
                class="!w-auto !px-3 !py-1.5 !text-xs"
                @click="showSaveSegmentModal = true"
              >
                Save segment
              </BaseButton>
              <BaseButton
                variant="secondary"
                class="!w-auto !px-3 !py-1.5 !text-xs"
                @click="exportCandidates('csv')"
              >
                Export
              </BaseButton>
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
                      <BaseBadge
                        v-if="candidate.isDuplicate"
                        type="warning"
                        size="small"
                      >
                        dup?
                      </BaseBadge>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-xs text-slate-600">{{ candidate.province }}</td>
                  <td class="px-4 py-3 text-xs text-slate-600">
                    {{ candidate.organization || '—' }}
                  </td>
                  <td class="px-4 py-3">                      <BaseBadge
                        v-if="candidate.examResult"
                        :type="candidate.examResult === 'pass' ? 'success' : 'danger'"
                        size="small"
                      >
                        {{ candidate.examResult === 'pass' ? 'Pass' : 'Fail' }} · {{ candidate.examScore }}
                      </BaseBadge>
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
          <BasePagination
            :current-page="currentPage"
            :total="filteredCandidates.length"
            :page-size="pageSize"
            class="mt-4"
            @update:current-page="goToPage"
          />

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

    <!-- Save Segment Modal -->
    <BaseModal v-model="showSaveSegmentModal" title="Save segment" width="480px">
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Segment name</label>
          <input
            v-model="segmentName"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Battambang officers"
            @keyup.enter="handleSaveSegment"
          />
        </div>
        <p class="text-xs text-slate-500">
          Saves current filters and {{ filteredCandidates.length }} matching candidates as a reusable segment.
        </p>
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <BaseButton
            variant="secondary"
            class="!w-auto"
            @click="showSaveSegmentModal = false"
          >
            Cancel
          </BaseButton>
          <BaseButton
            class="!w-auto"
            :disabled="!segmentName.trim()"
            @click="handleSaveSegment"
          >
            Save
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
