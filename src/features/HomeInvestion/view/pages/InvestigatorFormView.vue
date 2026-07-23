<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import FileUploader from '../../components/FileUploader.vue'
import {
  fetchInvestigationById,
  saveDraft,
  submitForReview,
  addAttachment,
  removeAttachment,
} from '../../service/investigationService'
import type { Investigation, Attachment } from '../../types/investigation'

const route = useRoute()

const loading = ref(true)
const saving = ref(false)
const submitting = ref(false)
const investigation = ref<Investigation | null>(null)
const attachments = ref<Attachment[]>([])
const form = ref({
  visitDate: '',
  recommendation: '' as 'Recommend' | 'Not Recommend' | '',
  notes: '',
})

onMounted(async () => {
  const id = route.params.id as string
  try {
    investigation.value = await fetchInvestigationById(id)
    if (investigation.value) {
      form.value.visitDate = investigation.value.visitDate || ''
      form.value.recommendation = investigation.value.recommendation || ''
      form.value.notes = investigation.value.notes || ''
    }
  } catch (error) {
    console.error('Failed to load investigation:', error)
  } finally {
    loading.value = false
  }
})

async function handleSaveDraft() {
  if (!investigation.value) return
  saving.value = true
  try {
    const updated = await saveDraft({
      ...investigation.value,
      visitDate: form.value.visitDate,
      recommendation: form.value.recommendation as 'Recommend' | 'Not Recommend',
      notes: form.value.notes,
    })
    investigation.value = updated
    alert('Draft saved successfully')
  } catch (error) {
    console.error('Failed to save draft:', error)
    alert('Failed to save draft')
  } finally {
    saving.value = false
  }
}

async function handleSubmit() {
  if (!investigation.value) return
  if (!form.value.visitDate || !form.value.recommendation || !form.value.notes) {
    alert('Please fill in all required fields')
    return
  }

  submitting.value = true
  try {
    const updated = await submitForReview({
      ...investigation.value,
      visitDate: form.value.visitDate,
      recommendation: form.value.recommendation as 'Recommend' | 'Not Recommend',
      notes: form.value.notes,
    })
    investigation.value = updated
    alert('Investigation submitted successfully')
  } catch (error) {
    console.error('Failed to submit investigation:', error)
    alert('Failed to submit investigation')
  } finally {
    submitting.value = false
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

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading">
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-6 w-48 rounded bg-slate-200"></div>
          <div class="h-4 w-full rounded bg-slate-200"></div>
          <div class="h-4 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!investigation">
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <p class="text-sm text-slate-500">Investigation not found</p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">{{ investigation.candidateName }}</h1>
            <p class="mt-1 text-sm text-slate-600">{{ investigation.campaign }}</p>
          </div>
          <span class="rounded-full border px-3 py-1 text-xs font-medium" :class="{
            'bg-slate-100 text-slate-700 border-slate-200': investigation.status === 'Pending',
            'bg-blue-50 text-blue-700 border-blue-200': investigation.status === 'In Progress',
            'bg-orange-50 text-orange-700 border-orange-200': investigation.status === 'Submitted',
          }">
            {{ investigation.status }}
          </span>
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
        </div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Investigation Form</h2>

        <div class="space-y-6">
          <div>
            <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
              Visit Date *
            </label>
            <input
              v-model="form.visitDate"
              type="date"
              class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
              Recommendation *
            </label>
            <div class="mt-2 flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.recommendation"
                  type="radio"
                  value="Recommend"
                  class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <span class="text-sm text-slate-700">Recommend</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.recommendation"
                  type="radio"
                  value="Not Recommend"
                  class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <span class="text-sm text-slate-700">Not Recommend</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
              Notes *
            </label>
            <textarea
              v-model="form.notes"
              rows="6"
              class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your investigation notes and findings..."
            ></textarea>
          </div>

          <div>
            <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
              Upload Evidence
            </label>
            <p class="mt-1 text-xs text-slate-500">Accepted files: JPG, PNG, PDF (max 5MB)</p>
            <div class="mt-3">
              <FileUploader accept="image/*,.pdf" @upload="handleFileUpload" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <BaseButton
            variant="secondary"
            :loading="saving"
            :disabled="saving || submitting"
            @click="handleSaveDraft"
          >
            {{ saving ? 'Saving...' : 'Save Draft' }}
          </BaseButton>
          <BaseButton
            :loading="submitting"
            :disabled="saving || submitting"
            @click="handleSubmit"
          >
            {{ submitting ? 'Submitting...' : 'Submit Investigation' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>