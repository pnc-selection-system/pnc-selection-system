<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from '../../components/StatusBadge.vue'
import FilterBar from '../../components/FilterBar.vue'
import Pagination from '../../components/Pagination.vue'
import LoadingSkeleton from '../../components/LoadingSkeleton.vue'
import EmptyState from '../../components/EmptyState.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  fetchInvestigations,
  deleteInvestigation,
  fetchCampaigns,
  fetchInvestigators,
} from '../../service/investigationService'
import type { Investigation, InvestigationFilters, InvestigationStatus } from '../../types/investigation'

const router = useRouter()

const loading = ref(true)
const investigations = ref<Investigation[]>([])
const campaigns = ref<string[]>([])
const investigators = ref<{ id: string; name: string }[]>([])
const filters = ref<InvestigationFilters>({})
const pagination = ref({ page: 1, pageSize: 10, total: 0, totalPages: 0 })
const deleteDialogOpen = ref(false)
const investigationToDelete = ref<string | null>(null)
const deleting = ref(false)

const statuses: InvestigationStatus[] = ['Pending', 'In Progress', 'Submitted', 'Approved', 'Rejected']

onMounted(async () => {
  try {
    campaigns.value = await fetchCampaigns()
    investigators.value = await fetchInvestigators()
    await loadInvestigations()
  } catch (error) {
    console.error('Failed to load investigations:', error)
  } finally {
    loading.value = false
  }
})

async function loadInvestigations() {
  loading.value = true
  try {
    const result = await fetchInvestigations(filters.value, {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    investigations.value = result.data
    pagination.value = result.pagination
  } catch (error) {
    console.error('Failed to load investigations:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.value.page = 1
  loadInvestigations()
}

function handleReset() {
  filters.value = {}
  pagination.value.page = 1
  loadInvestigations()
}

function handlePageChange(page: number) {
  pagination.value.page = page
  loadInvestigations()
}

function handleView(id: string) {
  router.push(`/evaluation/home-investigation/${id}`)
}

function handleEdit(id: string) {
  router.push(`/evaluation/home-investigation/${id}/edit`)
}

function handleDelete(id: string) {
  investigationToDelete.value = id
  deleteDialogOpen.value = true
}

async function confirmDelete() {
  if (!investigationToDelete.value) return
  deleting.value = true
  try {
    await deleteInvestigation(investigationToDelete.value)
    await loadInvestigations()
  } catch (error) {
    console.error('Failed to delete investigation:', error)
  } finally {
    deleting.value = false
    deleteDialogOpen.value = false
    investigationToDelete.value = null
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Investigations</h1>
        <p class="mt-1 text-sm text-slate-600">Manage and track all home investigations</p>
      </div>
      <BaseButton @click="router.push('/evaluation/home-investigation/create')">
        Create Investigation
      </BaseButton>
    </div>

    <FilterBar
      :filters="filters"
      :campaigns="campaigns"
      :investigators="investigators"
      :statuses="statuses"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="rounded-lg border border-slate-200 bg-white">
      <LoadingSkeleton v-if="loading" type="table" />

      <div v-else-if="investigations.length === 0">
        <EmptyState title="No investigations found" description="Try adjusting your filters or create a new investigation." />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Candidate</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Campaign</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Investigator</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Scheduled Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Last Updated</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="investigation in investigations" :key="investigation.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-sm font-medium text-slate-900">{{ investigation.candidateName }}</td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ investigation.campaign }}</td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ investigation.investigatorName || '-' }}</td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(investigation.scheduledDate) }}</td>
              <td class="px-4 py-3">
                <StatusBadge :status="investigation.status" />
              </td>
              <td class="px-4 py-3 text-sm text-slate-600">{{ formatDate(investigation.updatedAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    @click="handleView(investigation.id)"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    class="text-slate-600 hover:text-slate-700 text-sm font-medium"
                    @click="handleEdit(investigation.id)"
                  >
                    Edit
                  </button>
                  <button
                    v-if="investigation.status === 'Pending' || investigation.status === 'Rejected'"
                    type="button"
                    class="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    @click="router.push(`/evaluation/home-investigation/${investigation.id}/submit`)"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-700 text-sm font-medium"
                    @click="handleDelete(investigation.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
      :page="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      :total-pages="pagination.totalPages"
      @update:page="handlePageChange"
    />

    <ConfirmDialog
      :open="deleteDialogOpen"
      title="Delete Investigation"
      message="Are you sure you want to delete this investigation? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteDialogOpen = false"
    />
  </div>
</template>