<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '../../components/StatusBadge.vue'
import HistoryTimeline from '../../components/HistoryTimeline.vue'
import FileUploader from '../../components/FileUploader.vue'
import LoadingSkeleton from '../../components/LoadingSkeleton.vue'
import EmptyState from '../../components/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  fetchInvestigationById,
  fetchInvestigationHistory,
  addAttachment,
  removeAttachment,
  approveInvestigation,
  rejectInvestigation,
} from '../../service/investigationService'
import type { Investigation, InvestigationHistory } from '../../types/investigation'
import type { Attachment } from '../../types/attachment'

const route = useRoute()

const loading = ref(true)
const investigation = ref<Investigation | null>(null)
const history = ref<InvestigationHistory[]>([])
const attachments = ref<Attachment[]>([])
const activeTab = ref('overview')
const reviewModalOpen = ref(false)
const rejectionReason = ref('')
const processing = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  try {
    investigation.value = await fetchInvestigationById(id)
    history.value = await fetchInvestigationHistory(id)
  } catch (error) {
    console.error('Failed to load investigation:', error)
  } finally {
    loading.value = false
  }
})

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function handleApprove() {
  if (!investigation.value) return
  processing.value = true
  try {
    await approveInvestigation(investigation.value.id)
    investigation.value.status = 'Approved'
    history.value.push({
      id: `h${Date.now()}`,
      investigationId: investigation.value.id,
      action: 'Approved',
      userId: 'admin',
      userName: 'Admin User',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to approve investigation:', error)
  } finally {
    processing.value = false
    reviewModalOpen.value = false
  }
}

async function handleReject() {
  if (!investigation.value || !rejectionReason.value) return
  processing.value = true
  try {
    await rejectInvestigation(investigation.value.id, rejectionReason.value)
    investigation.value.status = 'Rejected'
    investigation.value.rejectionReason = rejectionReason.value
    history.value.push({
      id: `h${Date.now()}`,
      investigationId: investigation.value.id,
      action: 'Rejected',
      userId: 'admin',
      userName: 'Admin User',
      timestamp: new Date().toISOString(),
      notes: rejectionReason.value,
    })
  } catch (error) {
    console.error('Failed to reject investigation:', error)
  } finally {
    processing.value = false
    reviewModalOpen.value = false
    rejectionReason.value = ''
  }
}

async function handleFileUpload(file: File) {
  if (!investigation.value) return
  try {
    const attachment = await addAttachment(investigation.value.candidateId, file)
    attachments.value.push(attachment)
  } catch (error) {
    console.error('Failed to upload file:', error)
  }
}

async function handleFileRemove(attachment: Attachment) {
  try {
    await removeAttachment(investigation.value!.candidateId, attachment.id)
    attachments.value = attachments.value.filter((a) => a.id !== attachment.id)
  } catch (error) {
    console.error('Failed to remove file:', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading">
      <LoadingSkeleton type="detail" />
    </div>

    <div v-else-if="!investigation">
      <EmptyState title="Investigation not found" description="The investigation you're looking for doesn't exist." />
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <img
              v-if="investigation.candidatePhoto"
              :src="investigation.candidatePhoto"
              :alt="investigation.candidateName"
              class="h-16 w-16 rounded-full object-cover"
            />
            <div v-else class="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
              <span class="text-2xl text-slate-400">👤</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-800">{{ investigation.candidateName }}</h1>
              <div class="mt-1 flex items-center gap-4 text-sm text-slate-600">
                <span v-if="investigation.gender">{{ investigation.gender }}</span>
                <span v-if="investigation.school">{{ investigation.school }}</span>
                <span>{{ investigation.campaign }}</span>
              </div>
            </div>
          </div>
          <StatusBadge :status="investigation.status" />
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
          <div>
            <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Investigator</p>
            <p class="mt-1 text-sm text-slate-700">{{ investigation.investigatorName || '-' }}</p>
          </div>
          <div>
            <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Scheduled Date</p>
            <p class="mt-1 text-sm text-slate-700">{{ formatDate(investigation.scheduledDate) }}</p>
          </div>
          <div>
            <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Visit Date</p>
            <p class="mt-1 text-sm text-slate-700">{{ formatDate(investigation.visitDate || '') }}</p>
          </div>
          <div>
            <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Current Status</p>
            <p class="mt-1 text-sm text-slate-700">{{ investigation.status }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white">
        <div class="border-b border-slate-200">
          <nav class="flex gap-4 px-6">
            <button
              v-for="tab in ['overview', 'notes', 'files', 'history']"
              :key="tab"
              type="button"
              class="py-4 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
              @click="activeTab = tab"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <div v-if="activeTab === 'overview'" class="space-y-4">
            <div v-if="investigation.recommendation">
              <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Recommendation</p>
              <p class="mt-1 text-sm text-slate-700">{{ investigation.recommendation }}</p>
            </div>
            <div v-if="investigation.visitDate">
              <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Visit Date</p>
              <p class="mt-1 text-sm text-slate-700">{{ formatDate(investigation.visitDate) }}</p>
            </div>
            <div v-if="investigation.summary">
              <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Summary</p>
              <p class="mt-1 text-sm text-slate-700">{{ investigation.summary }}</p>
            </div>
            <div v-if="investigation.rejectionReason">
              <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Rejection Reason</p>
              <p class="mt-1 text-sm text-red-600">{{ investigation.rejectionReason }}</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'notes'" class="space-y-4">
            <label class="font-mono text-xs font-medium uppercase tracking-wider text-slate-400">Investigation Notes</label>
            <textarea
              v-if="investigation.notes"
              rows="8"
              class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
              readonly
              :value="investigation.notes"
            ></textarea>
            <p v-else class="text-sm text-slate-500">No notes available</p>
          </div>

          <div v-else-if="activeTab === 'files'" class="space-y-4">
            <FileUploader @upload="handleFileUpload" />
            <div v-if="attachments.length > 0" class="grid grid-cols-2 gap-4 mt-6">
              <div v-for="attachment in attachments" :key="attachment.id" class="rounded-lg border border-slate-200 p-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                      <span class="text-xl">{{ attachment.type === 'image' ? '🖼️' : '📄' }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-700">{{ attachment.name }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-700"
                    @click="handleFileRemove(attachment)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div v-else>
              <EmptyState title="No files uploaded" description="Upload photos or documents related to this investigation." />
            </div>
          </div>

          <div v-else-if="activeTab === 'history'">
            <HistoryTimeline :history="history" />
          </div>
        </div>
      </div>

      <div v-if="investigation.status === 'Submitted'" class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" @click="reviewModalOpen = true">
          Reject
        </BaseButton>
        <BaseButton @click="handleApprove" :loading="processing">
          Approve
        </BaseButton>
      </div>
    </div>

    <div v-if="reviewModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50" @click="reviewModalOpen = false"></div>
        <div class="relative rounded-lg bg-white p-6 shadow-xl max-w-md w-full">
          <h3 class="text-lg font-semibold text-slate-900">Reject Investigation</h3>
          <p class="mt-2 text-sm text-slate-600">Please provide a reason for rejecting this investigation.</p>
          <textarea
            v-model="rejectionReason"
            rows="4"
            class="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Enter rejection reason..."
          ></textarea>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              @click="reviewModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              :disabled="!rejectionReason"
              @click="handleReject"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>