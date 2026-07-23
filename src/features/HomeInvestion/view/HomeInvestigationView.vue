<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import AssignedVisitsList from '../components/AssignedVisitsList.vue'
import VisitDetailHeader from '../components/VisitDetailHeader.vue'
import VisitForm from '../components/VisitForm.vue'
import HomeInvestigationSkeleton from '../components/HomeInvestigationSkeleton.vue'
import { useInvestigationStore } from '../store/useInvestigationStore'
import {
  addAttachment,
  fetchAssignedVisits,
  fetchAttachments,
  fetchPageMeta,
  fetchVisitDetail,
  removeAttachment,
  saveDraft,
  submitForReview,
} from '../service/service'
import type { Attachment } from '../types/attachment'
import type { AssignedVisit, PageMeta, VisitDetail } from '../types/visit'

const store = useInvestigationStore()

const loading = ref(true)
const meta = ref<PageMeta | null>(null)
const visits = ref<AssignedVisit[]>([])
const selectedCandidateId = ref<string | null>(null)
const detail = ref<VisitDetail | null>(null)
const attachments = ref<Attachment[]>([])
const saving = ref(false)
const submitting = ref(false)

async function selectVisit(visit: AssignedVisit) {
  selectedCandidateId.value = visit.candidateId
  detail.value = await fetchVisitDetail(visit.candidateId)
  attachments.value = await fetchAttachments(visit.candidateId)
}

async function handleAddAttachment(file: File) {
  if (!detail.value) return
  const created = await addAttachment(detail.value.candidateId, file)
  attachments.value = [...attachments.value, created]
}

async function handleRemoveAttachment(attachment: Attachment) {
  if (!detail.value) return
  await removeAttachment(detail.value.candidateId, attachment.id)
  attachments.value = attachments.value.filter((a) => a.id !== attachment.id)
}

async function handleSaveDraft() {
  if (!detail.value) return
  saving.value = true
  try {
    detail.value = await saveDraft(detail.value)
    store.setStatus(detail.value.candidateId, detail.value.status)
    visits.value = visits.value.map((v) => (v.candidateId === detail.value!.candidateId ? { ...v, status: detail.value!.status } : v))
  } finally {
    saving.value = false
  }
}

async function handleSubmit() {
  if (!detail.value) return
  submitting.value = true
  try {
    detail.value = await submitForReview(detail.value)
    store.setStatus(detail.value.candidateId, detail.value.status)
    visits.value = visits.value.map((v) => (v.candidateId === detail.value!.candidateId ? { ...v, status: detail.value!.status } : v))
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    meta.value = await fetchPageMeta()
    visits.value = await fetchAssignedVisits()
    await store.load()
    const first = visits.value[0]
    if (first) await selectVisit(first)
  } catch (err) {
    console.error('Failed to load home investigation data:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader v-if="meta" :meta="meta" />

      <HomeInvestigationSkeleton v-if="loading" />

      <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <div>
          <AssignedVisitsList :visits="visits" :selected-candidate-id="selectedCandidateId" @select="selectVisit" />
        </div>

        <div v-if="detail" class="rounded-lg border border-slate-200 bg-white">
          <VisitDetailHeader :candidate-name="detail.candidateName" :status="detail.status" />
          <VisitForm
            v-model="detail"
            :attachments="attachments"
            :saving="saving"
            :submitting="submitting"
            @add-attachment="handleAddAttachment"
            @remove-attachment="handleRemoveAttachment"
            @save-draft="handleSaveDraft"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>