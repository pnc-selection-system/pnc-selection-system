<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import StatusBadge from './StatusBadge.vue'
import FileUploadZone from './FileUploadZone.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { InvestigationFormData, AttachmentFile } from '../types/visit'

const props = defineProps<{
  formData: InvestigationFormData | null
  attachments: AttachmentFile[]
  saving: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:formData': [data: InvestigationFormData]
  addAttachment: [file: File]
  removeAttachment: [attachmentId: string]
  retryAttachment: [attachmentId: string]
  saveDraft: []
  submit: []
}>()

const isSubmitted = computed(() => props.formData?.currentStatus === 'Submitted')
const isInProgress = computed(() => props.formData?.currentStatus === 'In Progress')
const canEdit = computed(() => !isSubmitted.value)

const localData = ref<InvestigationFormData | null>(null)

watch(
  () => props.formData,
  (val) => {
    if (val) localData.value = { ...val }
  },
  { immediate: true, deep: true },
)

function updateField<K extends keyof InvestigationFormData>(key: K, value: InvestigationFormData[K]) {
  if (!localData.value || !canEdit.value) return
  localData.value[key] = value
  emit('update:formData', { ...localData.value } as InvestigationFormData)
}

function getCurrentPosition() {
  if (!navigator.geolocation || !localData.value || !canEdit.value) return
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      updateField('gpsCoordinates', `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
    },
    () => {
      // Handle error silently
    },
  )
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`
  return `${bytes} B`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB')
}

function downloadFile(attachment: AttachmentFile) {
  if (attachment.url) {
    const a = document.createElement('a')
    a.href = attachment.url
    a.download = attachment.name
    a.click()
  }
}

/** Hide the img element when the image fails to load (broken URL or 403) */
function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  // Show the fallback placeholder sibling if it exists
  const parent = img.parentElement
  if (parent) {
    const placeholder = parent.querySelector('.image-placeholder')
    if (placeholder) {
      (placeholder as HTMLElement).style.display = 'flex'
    }
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
    <!-- Candidate Information Card -->
    <div class="border-b border-slate-100 bg-gradient-to-br from-blue-50/40 via-white to-white px-6 py-5">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
          <svg class="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Candidate Information
        </h3>
      </div>
      <div v-if="localData" class="grid grid-cols-2 gap-x-6 gap-y-3">
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Candidate ID</span>
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700">{{ localData.candidateId }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Name</span>
          <span class="text-sm font-semibold text-slate-800">{{ localData.candidateName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Campaign</span>
          <span class="text-xs text-slate-600">{{ localData.campaign }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Gender</span>
          <span class="text-xs text-slate-600">{{ localData.gender || '—' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Phone</span>
          <span class="text-xs text-slate-600">{{ localData.phoneNumber || '—' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Address</span>
          <span class="text-xs text-slate-600">{{ localData.currentAddress || '—' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Investigator</span>
          <span class="text-xs text-slate-600">{{ localData.assignedInvestigator }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 min-w-[90px]">Status</span>
          <StatusBadge :status="localData.currentStatus" />
        </div>
      </div>
    </div>

    <!-- Form Sections -->
    <div v-if="localData" class="space-y-0 px-6 py-5">
      <!-- Investigation Information -->
      <div class="pb-6">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100">
            <svg class="h-3.5 w-3.5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Investigation Information
          </h3>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Visit Date
            </label>
            <div class="relative">
              <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-violet-300 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                :value="localData.visitDate"
                :disabled="!canEdit"
                @input="updateField('visitDate', ($event.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Location -->
      <div class="py-6">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100">
            <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</h3>
        </div>
        <div class="space-y-3">
          <div>
            <label class="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Address
            </label>
            <input
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-300 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Enter full address"
              :value="localData.location"
              :disabled="!canEdit"
              @input="updateField('location', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="flex items-end gap-3">
            <div class="flex-1">
              <label class="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                GPS Coordinates
              </label>
              <input
                type="text"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-300 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                placeholder="Latitude, Longitude"
                :value="localData.gpsCoordinates"
                :disabled="!canEdit"
                @input="updateField('gpsCoordinates', ($event.target as HTMLInputElement).value)"
              />
            </div>
            <button
              type="button"
              class="flex h-[42px] flex-shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-semibold text-emerald-700 shadow-sm transition-all duration-150 hover:bg-emerald-100 hover:shadow disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              :disabled="!canEdit"
              @click="getCurrentPosition"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Location
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100" />

      <!-- People Met -->
      <div class="py-6">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100">
            <svg class="h-3.5 w-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">People Met</h3>
        </div>
        <textarea
          class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-amber-300 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          rows="3"
          placeholder="e.g. Mother, Father, Younger Sister, Village Chief"
          :value="localData.peopleMet"
          :disabled="!canEdit"
          @input="updateField('peopleMet', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Observations -->
      <div class="py-6">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100">
            <svg class="h-3.5 w-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">Observations</h3>
        </div>
        <textarea
          class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          rows="5"
          placeholder="Describe the household conditions, family environment, living conditions, education support, health situation, financial condition, and any concerns observed during the visit."
          :value="localData.observations"
          :disabled="!canEdit"
          @input="updateField('observations', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Findings & Recommendation -->
      <div class="py-6">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100">
            <svg class="h-3.5 w-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Findings &amp; Recommendation
          </h3>
        </div>
        <textarea
          class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-300 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          rows="4"
          placeholder="Summary of investigation&#10;Recommendation: Recommend / Not Recommend&#10;Reason:"
          :value="localData.findings"
          :disabled="!canEdit"
          @input="updateField('findings', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Recommendation
            </label>
            <select
              class="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-300 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              :value="localData.recommendation"
              :disabled="!canEdit"
              @change="updateField('recommendation', ($event.target as HTMLSelectElement).value)"
            >
              <option value="">Select recommendation...</option>
              <option value="Recommend">✅ Recommend</option>
              <option value="Not Recommend">❌ Not Recommend</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Reason
            </label>
            <input
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-300 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Reason for recommendation"
              :value="localData.reason"
              :disabled="!canEdit"
              @input="updateField('reason', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100" />

      <!-- Photos & Documents -->
      <div class="py-6">
        <div class="mb-4 flex items-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-100">
            <svg class="h-3.5 w-3.5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Photos &amp; Documents
          </h3>
        </div>

        <!-- Upload area -->
        <FileUploadZone
          v-if="canEdit"
          :disabled="!canEdit"
          @upload="$emit('addAttachment', $event)"
        />

        <!-- File grid -->
        <div v-if="attachments.length" class="mt-4">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            <div
              v-for="att in attachments"
              :key="att.id"
              class="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200"
              :class="{
                'border-slate-200 hover:shadow-md': att.status === 'completed' || !att.status,
                'border-amber-300 bg-amber-50/30': att.status === 'uploading',
                'border-red-300 bg-red-50/30': att.status === 'error',
              }"
            >
              <!-- Uploading overlay -->
              <div v-if="att.status === 'uploading'" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
                <svg class="mb-1.5 h-6 w-6 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span class="text-[10px] font-medium text-amber-600">Uploading...</span>
              </div>

              <!-- Error overlay -->
              <div v-if="att.status === 'error'" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-50/80 backdrop-blur-[1px]">
                <svg class="mb-1 h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="mb-1.5 px-2 text-center text-[9px] font-medium text-red-600 leading-tight">Upload failed</span>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-all hover:bg-red-600"
                  @click="$emit('retryAttachment', att.id)"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>

              <!-- Image preview (shown when type is image and URL is available) -->
              <div v-if="att.type === 'image' && att.url" class="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  :src="att.url"
                  :alt="att.name"
                  class="h-full w-full object-cover transition-transform duration-200"
                  :class="{ 'group-hover:scale-105': att.status === 'completed' || !att.status }"
                  @error="onImageError"
                />
                <!-- Fallback placeholder (hidden by default, shown when image fails to load) -->
                <div class="image-placeholder hidden absolute inset-0 flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <!-- Placeholder when type is image but URL is missing -->
              <div v-else-if="att.type === 'image'" class="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <!-- Document icon -->
              <div v-else class="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <svg v-if="att.type === 'pdf'" class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <!-- File info -->
              <div class="border-t border-slate-100 px-3 py-2.5">
                <p class="truncate text-xs font-medium text-slate-700">{{ att.name }}</p>
                <p class="mt-0.5 text-[10px] text-slate-400">
                  {{ formatFileSize(att.size) }}
                  <template v-if="att.status === 'completed' || !att.status"> · {{ formatDate(att.uploadDate) }}</template>
                </p>
              </div>

              <!-- Actions overlay -->
              <div
                v-if="att.status !== 'uploading'"
                class="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100"
              >
                <button
                  v-if="(att.status === 'completed' || !att.status) && att.url"
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-150 hover:bg-white hover:text-slate-900 hover:shadow-md"
                  title="Download"
                  @click="downloadFile(att)"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  v-if="canEdit && att.status !== 'uploading'"
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-lg shadow-sm backdrop-blur-sm transition-all duration-150 hover:shadow-md"
                  :class="att.status === 'error' ? 'bg-red-100/90 text-red-600 hover:bg-red-100 hover:text-red-800' : 'bg-white/90 text-red-500 hover:bg-white hover:text-red-700'"
                  :title="att.status === 'error' ? 'Remove' : 'Delete'"
                  @click="$emit('removeAttachment', att.id)"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center">
          <svg class="mx-auto mb-2 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm font-medium text-slate-500">No files uploaded yet</p>
          <p class="mt-0.5 text-xs text-slate-400">Upload photos or documents using the area above</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="canEdit" class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div class="flex items-center gap-3">
          <BaseButton
            variant="secondary"
            class="!w-auto !rounded-xl !px-5 !py-2.5 text-sm font-semibold shadow-sm"
            :loading="saving"
            :disabled="saving || submitting"
            @click="$emit('saveDraft')"
          >
            <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {{ saving ? 'Saving...' : 'Save Draft' }}
          </BaseButton>
        </div>
        <BaseButton
          class="!w-auto !rounded-xl !px-5 !py-2.5 text-sm font-semibold shadow-sm"
          :loading="submitting"
          :disabled="saving || submitting"
          @click="$emit('submit')"
        >
          <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ submitting ? 'Submitting...' : 'Submit Investigation' }}
        </BaseButton>
      </div>

      <!-- Submitted banner -->
      <div v-else class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div class="flex items-center gap-3 text-sm font-medium text-emerald-700">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p>Investigation Submitted</p>
            <p class="text-xs font-normal text-emerald-600">This investigation has been submitted and is now read-only.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state when no candidate selected -->
    <div v-else class="flex flex-col items-center justify-center px-6 py-20">
      <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <svg class="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-base font-semibold text-slate-600">No Candidate Selected</h3>
      <p class="mt-1.5 text-sm text-slate-400">Select a candidate from the list to start the investigation</p>
    </div>
  </div>
</template>
