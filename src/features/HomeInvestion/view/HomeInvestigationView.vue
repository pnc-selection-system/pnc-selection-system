<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import CandidateDataTable from '../components/CandidateDataTable.vue'
import InvestigationForm from '../components/InvestigationForm.vue'
import HomeInvestigationSkeleton from '../components/HomeInvestigationSkeleton.vue'
import { useOfflineDraft } from '../composables/useOfflineDraft'
import {
  fetchPageMeta,
  fetchCandidates,
  fetchFormData,
  fetchAttachments,
  fetchCampaigns,
  fetchInvestigators,
  fetchStatuses,
  addAttachment as apiAddAttachment,
  removeAttachment as apiRemoveAttachment,
} from '../service/service'
import type { Candidate, CandidateFilters, InvestigationFormData, AttachmentFile, AttachmentStatus, PageMeta } from '../types/visit'

const {
  hasLocalDraft,
  pendingActions,
  isOnline,
  syncing,
  saveDraft: offlineSaveDraft,
  submit: offlineSubmit,
  loadDraftFromStorage,
  clearDraft,
  syncPendingActions,
  cleanup,
} = useOfflineDraft()

const loading = ref(true)
const meta = ref<PageMeta | null>(null)

const candidates = ref<Candidate[]>([])
const campaigns = ref<string[]>([])
const investigators = ref<string[]>([])
const statuses = ref<string[]>([])
const selectedCandidateId = ref<string | null>(null)
const formData = ref<InvestigationFormData | null>(null)
const attachments = ref<AttachmentFile[]>([])
const saving = ref(false)
const submitting = ref(false)
let pendingIdCounter = 0

/** Count attachments that are still uploading or errored */
const pendingUploadCount = computed(() =>
  attachments.value.filter((a) => a.status === 'uploading' || a.status === 'error').length,
)

async function loadCandidates(filters?: CandidateFilters) {
  const f = filters || { search: '', campaign: '', investigator: '', status: '', dateFrom: '', dateTo: '' }
  candidates.value = await fetchCandidates(f)
}

function onFiltersChange(filters: CandidateFilters) {
  loadCandidates(filters)
}

async function selectCandidate(candidate: Candidate) {
  selectedCandidateId.value = candidate.candidateId
  formData.value = null
  attachments.value = []

  // Try to load from API first
  const [data, files] = await Promise.all([
    fetchFormData(candidate.candidateId),
    fetchAttachments(candidate.candidateId),
  ])

  if (data) {
    formData.value = data
    attachments.value = files.map((a) => ({ ...a, status: 'completed' as const }))
  } else {
    // API unavailable — try local draft
    const localDraft = loadDraftFromStorage(candidate.candidateId)
    if (localDraft) {
      formData.value = localDraft
    }
  }
}

function updateFormData(data: InvestigationFormData) {
  formData.value = data
}

async function handleAddAttachment(file: File) {
  if (!selectedCandidateId.value) return

  const localId = `pending_${++pendingIdCounter}`

  // Show file immediately with pending/uploading state
  const pendingAttachment: AttachmentFile = {
    id: localId,
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'docx',
    size: file.size,
    uploadDate: new Date().toISOString(),
    status: 'uploading',
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }
  attachments.value = [...attachments.value, pendingAttachment]

  try {
    const created = await apiAddAttachment(selectedCandidateId.value, file)
    // Replace pending item with the real uploaded attachment
    attachments.value = attachments.value.map((a) =>
      a.id === localId ? { ...created, status: 'completed' as AttachmentStatus } : a,
    )
  } catch (e: any) {
    // Show error state on the item
    const errorMsg = e?.response?.data?.error || e?.message || 'Upload failed'
    attachments.value = attachments.value.map((a) =>
      a.id === localId
        ? { ...a, status: 'error' as AttachmentStatus, errorMessage: errorMsg }
        : a,
    )
    console.error('Upload failed:', errorMsg)
  }
}

async function handleRetryAttachment(attachmentId: string) {
  if (!selectedCandidateId.value) return

  // Find the failed attachment
  const failed = attachments.value.find((a) => a.id === attachmentId)
  if (!failed) return

  // Set back to uploading
  attachments.value = attachments.value.map((a) =>
    a.id === attachmentId ? { ...a, status: 'uploading' as AttachmentStatus, errorMessage: undefined } : a,
  )

  // Recreate the File object from the stored data (won't work perfectly for all cases,
  // but we'll try the best we can)
  try {
    const response = await fetch(failed.url || '')
    const blob = await response.blob()
    const file = new File([blob], failed.name, { type: blob.type })
    const created = await apiAddAttachment(selectedCandidateId.value, file)
    attachments.value = attachments.value.map((a) =>
      a.id === attachmentId ? { ...created, status: 'completed' as AttachmentStatus } : a,
    )
  } catch {
    attachments.value = attachments.value.map((a) =>
      a.id === attachmentId
        ? { ...a, status: 'error' as AttachmentStatus, errorMessage: 'Retry failed. Please upload again.' }
        : a,
    )
  }
}

async function handleRemoveAttachment(attachmentId: string) {
  if (!selectedCandidateId.value) return

  const attachment = attachments.value.find((a) => a.id === attachmentId)
  if (!attachment) return

  // If it failed or is pending, just remove from local list
  if (attachment.status === 'error' || attachment.status === 'uploading') {
    attachments.value = attachments.value.filter((a) => a.id !== attachmentId)
    if (attachment.url?.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url)
    }
    return
  }

  if (!navigator.onLine) return

  try {
    await apiRemoveAttachment(selectedCandidateId.value, attachmentId)
    attachments.value = attachments.value.filter((a) => a.id !== attachmentId)
  } catch (e) {
    console.error('Failed to remove attachment:', e)
  }
}

async function handleSaveDraft() {
  if (!formData.value) return
  saving.value = true
  try {
    const result = await offlineSaveDraft(formData.value)
    if (result) {
      formData.value = result
      candidates.value = candidates.value.map((c) =>
        c.candidateId === result.candidateId ? { ...c, status: result.currentStatus } : c,
      )
    }
  } finally {
    saving.value = false
  }
}

async function handleSubmit() {
  if (!formData.value) return
  submitting.value = true
  try {
    const result = await offlineSubmit(formData.value)
    if (result) {
      formData.value = result
      candidates.value = candidates.value.map((c) =>
        c.candidateId === result.candidateId ? { ...c, status: result.currentStatus } : c,
      )
    }
  } finally {
    submitting.value = false
  }
}

// Clean up window event listeners
onUnmounted(() => {
  cleanup()
})

// Auto-sync pending save/submit actions when coming back online
watch(isOnline, async (online) => {
  if (!online) return
  await syncPendingActions()
})

onMounted(async () => {
  try {
    const [metaData, camps, invs, sts] = await Promise.all([
      fetchPageMeta(),
      fetchCampaigns(),
      fetchInvestigators(),
      fetchStatuses(),
    ])
    meta.value = metaData
    campaigns.value = camps
    investigators.value = invs
    statuses.value = sts
    await loadCandidates()
  } catch (err) {
    console.error('Failed to load home investigation data:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50/50 to-white">
    <div class="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-2">
        <PageHeader v-if="meta" :meta="meta" />
      </div>

      <!-- Skeleton loading -->
      <HomeInvestigationSkeleton v-if="loading" />

      <!-- Offline status bar -->
      <div v-if="!loading && !isOnline" class="mb-3">
        <div class="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 shadow-sm">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.95 4.95a3 3 0 010-4.243M6.343 17.657a9 9 0 010-12.728" />
          </svg>
          <span class="font-medium">You are offline</span>
          <span class="text-amber-600">Changes will be saved locally and synced when you reconnect.</span>
        </div>
      </div>
      <!-- Pending sync status bar -->
      <div v-if="!loading && isOnline && (pendingActions.length > 0 || pendingUploadCount > 0)" class="mb-3">
        <div class="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700 shadow-sm">
          <svg class="h-4 w-4 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span class="font-medium">Syncing...</span>
          <span class="text-blue-600">
            {{ pendingActions.length }} pending save{{ pendingActions.length !== 1 ? 's' : '' }}
            <template v-if="pendingUploadCount > 0">
              &middot; {{ pendingUploadCount }} pending upload{{ pendingUploadCount !== 1 ? 's' : '' }}
            </template>
          </span>
        </div>
      </div>

      <!-- Main content (always shown when not loading) -->
      <div v-if="!loading" class="mt-5 grid grid-cols-1 gap-6 xl:grid-cols-[440px_1fr]">
        <!-- Left Panel: Candidate List -->
        <div class="xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-1">
          <div class="xl:sticky xl:top-0">
            <CandidateDataTable
              :candidates="candidates"
              :selected-candidate-id="selectedCandidateId"
              :campaigns="campaigns"
              :investigators="investigators"
              :statuses="statuses"
              @select="selectCandidate"
              @update:filters="onFiltersChange"
            />
          </div>
        </div>

        <!-- Right Panel: Investigation Form -->
        <div class="xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto xl:pr-1">
          <InvestigationForm
            :form-data="formData"
            :attachments="attachments"
            :saving="saving"
            :submitting="submitting"
            @update:form-data="updateFormData"
            @add-attachment="handleAddAttachment"
            @remove-attachment="handleRemoveAttachment"
            @retry-attachment="handleRetryAttachment"
            @save-draft="handleSaveDraft"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
