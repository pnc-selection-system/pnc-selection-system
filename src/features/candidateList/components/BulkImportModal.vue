<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import { uploadImportFile, confirmImport, checkDuplicateCandidate } from '../services/candidateService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { fetchProvinces } from '@/features/CandidateList/services/provinceService'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import type { Campaign } from '@/features/campaign/types'
import type { ProvinceData } from '@/features/CandidateList/services/provinceService'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'
import type { ImportUploadResponse } from '../types/api'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'imported'): void
}>()

const proxyVisible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})

// --- State ---
type Step = 'upload' | 'confirming' | 'done'

const currentStep = ref<Step>('upload')
const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadError = ref<string | null>(null)
const uploadResult = ref<ImportUploadResponse | null>(null)
const confirmingError = ref<string | null>(null)
const confirmResult = ref<{ imported: number; skipped: number } | null>(null)

// --- Duplicate checking ---
const checkingDuplicates = ref(false)
const duplicateRows = ref<Set<number>>(new Set())

// --- Campaign, Province & NGO selection ---
const campaigns = ref<Campaign[]>([])
const provinces = ref<ProvinceData[]>([])
const ngos = ref<NgoPartner[]>([])
const selectedCampaignId = ref<number | null>(null)
const selectedProvinceId = ref<number | null>(null)
const selectedNgoId = ref<number | null>(null)
const loadingMeta = ref(false)

async function loadMeta() {
  loadingMeta.value = true
  try {
    const [campaignsData, provincesData, ngosData] = await Promise.all([
      fetchCampaigns(),
      fetchProvinces(),
      fetchPartners(),
    ])
    campaigns.value = campaignsData
    provinces.value = provincesData
    ngos.value = ngosData
  } catch {
    // Silently fail; user will see the empty dropdown
  } finally {
    loadingMeta.value = false
  }
}

/**
 * Extract a human-readable error message from an API error response.
 * Handles Laravel 422 validation errors with detailed field messages.
 */
function extractApiError(err: any, fallback: string): string {
  const response = err?.response
  if (!response) return err?.message || fallback

  const data = response.data

  // Laravel validation error: { message: "...", errors: { field: ["..."] } }
  if (response.status === 422 && data?.errors) {
    const fieldMessages: string[] = []
    for (const [field, messages] of Object.entries(data.errors)) {
      if (Array.isArray(messages)) {
        fieldMessages.push(...messages.map((m: string) => `${field}: ${m}`))
      }
    }
    if (fieldMessages.length > 0) {
      return fieldMessages.join('\n')
    }
    return data.message || fallback
  }

  // Generic Laravel error: { message: "..." }
  return data?.message || err?.message || fallback
}

// Track whether the component is still mounted to prevent stale state updates
let cancelled = false

// Reset state and load dependent data when modal opens
watch(proxyVisible, (visible) => {
  if (visible) {
    cancelled = false
    resetState()
    loadMeta()
  }
})

onMounted(() => {
  loadMeta()
})

function resetState() {
  currentStep.value = 'upload'
  selectedFile.value = null
  dragOver.value = false
  uploading.value = false
  uploadError.value = null
  uploadResult.value = null
  confirmingError.value = null
  confirmResult.value = null
  checkingDuplicates.value = false
  duplicateRows.value = new Set()
  selectedCampaignId.value = null
  selectedProvinceId.value = null
  selectedNgoId.value = null
}

// --- File handling ---
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) startUpload(file)
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) startUpload(file)
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

async function startUpload(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !['csv', 'xlsx', 'xls'].includes(ext)) {
    uploadError.value = 'Only CSV and Excel files (.csv, .xlsx, .xls) are supported.'
    return
  }

  if (!selectedCampaignId.value) {
    uploadError.value = 'Please select a campaign before uploading.'
    return
  }
  if (!selectedProvinceId.value) {
    uploadError.value = 'Please select a province before uploading.'
    return
  }

  selectedFile.value = file
  uploading.value = true
  uploadError.value = null
  currentStep.value = 'upload'

  try {
    const result = await uploadImportFile(file, {
      campaign_id: selectedCampaignId.value ?? undefined,
      province_id: selectedProvinceId.value ?? undefined,
      ngo_id: selectedNgoId.value ?? undefined,
    })
    if (cancelled) return
    uploadResult.value = result
    // Run duplicate checking on the preview data
    runDuplicateCheck(result)
  } catch (err: any) {
    if (cancelled) return
    selectedFile.value = null
    console.error('[Import Upload Error]', err?.response?.status, err?.response?.data)
    const msg = extractApiError(err, 'Failed to upload file.')
    uploadError.value = msg
  } finally {
    uploading.value = false
  }
}

// --- Confirmation ---
async function handleConfirm() {
  confirmingError.value = null
  currentStep.value = 'confirming'

  const result = uploadResult.value
  if (!result) {
    confirmingError.value = 'No upload result found. Please upload the file again.'
    currentStep.value = 'upload'
    return
  }

  // Exclude duplicate rows from the import
  const rowsToImport = allPreviewRows.value.filter(r => r.valid && !duplicateRows.value.has(r.row))
  if (rowsToImport.length === 0) {
    confirmingError.value = 'All valid rows are duplicates and will be skipped. Nothing to import.'
    currentStep.value = 'upload'
    return
  }

  // Build column mapping from detected columns + auto_mapping
  // Convert { "First Name": "first_name", ... } → { 0: "first_name", 1: "last_name", ... }
  const columnMapping: Record<number, string> = {}
  for (let i = 0; i < result.detected_columns.length; i++) {
    const colName = result.detected_columns[i]
    const dbField = result.auto_mapping[colName]
    if (dbField) {
      columnMapping[i] = dbField
    }
  }

  try {
    const confirmResultData = await confirmImport(result.import_file_id, columnMapping)
    if (cancelled) return

    confirmResult.value = { imported: confirmResultData.imported, skipped: confirmResultData.skipped }
    currentStep.value = 'done'
    emit('imported')

    if (confirmResultData.errors && confirmResultData.errors.length > 0) {
      confirmingError.value = confirmResultData.errors.join('\n')
    }
  } catch (err: any) {
    if (cancelled) return

    const msg = extractApiError(err, 'Failed to confirm import.')
    confirmingError.value = msg
    // Return to upload step so user can retry
    currentStep.value = 'upload'
  }
}

function closeModal() {
  cancelled = true
  resetState()
  emit('update:modelValue', false)
}

function goBackToUpload() {
  // Clear the file input so re-selecting the same file fires @change
  const input = document.getElementById('import-file-input') as HTMLInputElement
  if (input) input.value = ''
  selectedFile.value = null
  uploadResult.value = null
  uploadError.value = null
  confirmingError.value = null
  checkingDuplicates.value = false
  duplicateRows.value = new Set()
}

// --- Computed ---
/**
 * After upload, check which preview rows have duplicate name+phone combos.
 * Runs one API call per unique phone number from the valid rows.
 */
async function runDuplicateCheck(result: ImportUploadResponse) {
  const validRows = result.preview.filter(r => r.valid && r.phone)
  if (validRows.length === 0) {
    duplicateRows.value = new Set()
    return
  }

  checkingDuplicates.value = true
  const duplicates = new Set<number>()

  try {
    // Collect unique phone numbers to minimize API calls
    const uniquePhones = [...new Set(validRows.map(r => r.phone!))]

    // Check each phone against existing candidates
    const checks = uniquePhones.map(async (phone) => {
      try {
        const existing = await checkDuplicateCandidate(phone)
        if (existing.length === 0) return

        // Find which preview rows match this phone and have matching names
        const matchingRows = validRows.filter(r => {
          if (r.phone !== phone) return false
          const rowName = `${r.first_name} ${r.last_name}`.toLowerCase().trim()
          return existing.some((c) => {
            const existingName = `${c.first_name} ${c.last_name}`.toLowerCase().trim()
            return existingName === rowName
          })
        })

        matchingRows.forEach(r => duplicates.add(r.row))
      } catch {
        // Silently fail individual checks; user can still import
      }
    })

    await Promise.all(checks)
  } catch {
    // Silently fail; user can still import
  } finally {
    duplicateRows.value = duplicates
    checkingDuplicates.value = false
  }
}

const invalidCount = computed(() => {
  const rows = allPreviewRows.value
  return rows.filter(r => !r.valid).length
})

const duplicateCount = computed(() => {
  return duplicateRows.value.size
})

const validImportCount = computed(() => {
  if (!uploadResult.value) return 0
  const validRows = allPreviewRows.value.filter(r => r.valid)
  return validRows.length - duplicateRows.value.size
})

const allPreviewRows = computed(() => {
  return uploadResult.value?.preview ?? []
})

const fileSizeFormatted = computed(() => {
  if (!selectedFile.value) return ''
  const bytes = selectedFile.value.size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})
</script>

<template>
  <BaseModal v-model="proxyVisible" title="Bulk Import Candidates" width="760px">
    <!-- ======== STEP 1: Upload (drop zone, uploading, file-ready) ======== -->
    <template v-if="currentStep === 'upload'">
      <!-- Campaign, Province & NGO selectors -->
      <div class="mb-4 grid grid-cols-3 gap-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600">Campaign <span class="text-red-500">*</span></label>
          <div class="relative">
            <BaseSelect
              v-model="selectedCampaignId"
              placeholder="Select campaign..."
              :disabled="loadingMeta || uploading || !!uploadResult"
              :options="campaigns.map(c => ({ value: c.id, label: `${c.name} (${c.year})` }))"
            />
            <div v-if="loadingMeta" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-3.5 w-3.5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600">Province <span class="text-red-500">*</span></label>
          <div class="relative">
            <BaseSelect
              v-model="selectedProvinceId"
              placeholder="Select province..."
              :disabled="loadingMeta || uploading || !!uploadResult"
              :options="provinces.map(p => ({ value: p.id, label: p.name }))"
            />
            <div v-if="loadingMeta" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-3.5 w-3.5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600">NGO <span class="text-xs text-slate-400 font-normal">(optional)</span></label>
          <div class="relative">
            <BaseSelect
              v-model="selectedNgoId"
              placeholder="Select NGO..."
              :disabled="loadingMeta || uploading || !!uploadResult"
              :options="ngos.map(n => ({ value: n.id, label: n.name }))"
              clearable
            />
            <div v-if="loadingMeta" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="h-3.5 w-3.5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== STATE: Drop zone (no file) ====== -->
      <div
        v-if="!selectedFile"
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-14 transition-colors"
        :class="dragOver ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50'"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
      >
        <input type="file" accept=".csv,.xlsx,.xls" class="hidden" id="import-file-input" @change="handleFileSelect" />
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <svg class="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="mt-4 text-sm text-slate-600">
          Drag and drop your Excel/CSV file here, or
          <label for="import-file-input" class="cursor-pointer font-semibold text-blue-600 hover:text-blue-500">browse</label>
        </p>
        <p class="mt-1 text-xs text-slate-400">Supports .csv, .xlsx, .xls files</p>
      </div>

      <!-- ====== STATE: Uploading ====== -->
      <div
        v-else-if="uploading"
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/30 px-6 py-14 transition-colors"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <svg class="h-7 w-7 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p class="mt-4 text-sm font-medium text-slate-600">Uploading and parsing file...</p>
        <p class="mt-1 text-xs text-slate-400">{{ selectedFile?.name }}</p>
      </div>

      <!-- ====== STATE: File uploaded + ready to import ====== -->
      <div
        v-else-if="uploadResult"
        class="flex flex-col items-center justify-center rounded-lg border-2 border-emerald-300 bg-emerald-50/30 px-6 py-10 transition-colors"
      >
        <!-- File icon -->
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <svg class="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- File name center -->
        <p class="mt-4 text-base font-semibold text-slate-800">{{ selectedFile?.name }}</p>
        <p class="mt-0.5 text-xs text-slate-400">{{ fileSizeFormatted }}</p>

        <!-- Summary chips -->
        <div class="mt-5 flex items-center gap-4">
          <div class="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
            <span class="text-xs font-semibold text-slate-700">{{ uploadResult.total_rows }}</span>
            <span class="text-[10px] text-slate-500">rows</span>
          </div>
          <div class="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1">
            <span class="text-xs font-semibold text-emerald-700">{{ uploadResult.valid_rows }}</span>
            <span class="text-[10px] text-emerald-600">valid</span>
          </div>
          <div v-if="invalidCount > 0" class="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1">
            <span class="text-xs font-semibold text-red-700">{{ invalidCount }}</span>
            <span class="text-[10px] text-red-600">invalid</span>
          </div>
          <!-- Checking duplicates spinner -->
          <div v-if="checkingDuplicates" class="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1">
            <svg class="h-3 w-3 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="text-[10px] text-blue-600">checking duplicates...</span>
          </div>
          <!-- Duplicate count chip -->
          <div v-else-if="duplicateCount > 0" class="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1">
            <span class="text-xs font-semibold text-amber-700">{{ duplicateCount }}</span>
            <span class="text-[10px] text-amber-600">duplicate{{ duplicateCount !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <!-- Duplicate warning banner -->
        <div
          v-if="!checkingDuplicates && duplicateCount > 0"
          class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2"
        >
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div class="text-sm text-amber-800">
            <span class="font-medium">{{ duplicateCount }} row{{ duplicateCount !== 1 ? 's' : '' }}</span>
            with matching name and phone already exist in the system and will be skipped.
          </div>
        </div>

        <!-- Change file link -->
        <button
          type="button"
          class="mt-4 text-xs text-slate-400 hover:text-slate-600 underline"
          @click="goBackToUpload"
        >
          Choose a different file
        </button>
      </div>

      <!-- ====== FALLBACK: File selected but no result (API format mismatch / unexpected state) ====== -->
      <div
        v-else
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/30 px-6 py-10 transition-colors"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <svg class="h-7 w-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p class="mt-4 text-sm font-semibold text-slate-700">Could not read file data</p>
        <p class="mt-1 text-xs text-slate-500 text-center max-w-xs">
          The server did not return valid candidate data. This may be a column mismatch.
        </p>
        <button
          type="button"
          class="mt-4 text-xs text-slate-400 hover:text-slate-600 underline"
          @click="goBackToUpload"
        >
          Choose a different file
        </button>
      </div>

      <!-- Upload Error -->
      <div v-if="uploadError" class="mt-4 rounded-lg bg-red-50 p-3">
        <div class="flex items-start gap-2">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-red-700 whitespace-pre-line">{{ uploadError }}</div>
        </div>
      </div>

      <!-- Confirming error (shown after failed import attempt) -->
      <div v-if="confirmingError" class="mt-4 rounded-lg bg-red-50 p-3">
        <div class="flex items-start gap-2">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-red-700 whitespace-pre-line">{{ confirmingError }}</div>
        </div>
      </div>
    </template>

    <!-- ======== STEP 3: Confirming... ======== -->
    <template v-else-if="currentStep === 'confirming'">
      <div class="flex flex-col items-center justify-center py-10">
        <svg class="h-10 w-10 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p class="mt-4 text-sm font-medium text-slate-700">Importing candidates...</p>
        <p class="mt-3 text-xs text-slate-400">Please wait while candidates are being created.</p>
      </div>
    </template>

    <!-- ======== STEP 4: Done ======== -->
    <template v-else-if="currentStep === 'done'">
      <div class="flex flex-col items-center py-8 text-center">
        <!-- Success / Partial / Failed icon -->
        <div
          :class="[
            'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
            confirmResult && confirmResult.imported > 0
              ? 'bg-emerald-50'
              : confirmResult && confirmResult.skipped > 0
                ? 'bg-amber-50'
                : 'bg-red-50'
          ]"
        >
          <!-- All succeeded -->
          <svg
            v-if="confirmResult && confirmResult.skipped === 0"
            class="h-8 w-8 text-emerald-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <!-- Partial / all failed -->
          <svg
            v-else
            class="h-8 w-8 text-amber-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <p class="mt-4 text-lg font-semibold text-slate-800">
          {{ confirmResult && confirmResult.imported > 0 ? 'Import Complete' : 'Import Finished' }}
        </p>

        <div class="mt-4 flex gap-8">
          <div v-if="confirmResult" class="text-center">
            <p class="text-2xl font-bold text-emerald-600">{{ confirmResult.imported }}</p>
            <p class="text-xs text-slate-500">Imported</p>
          </div>
          <div v-if="!confirmResult" class="text-center">
            <p class="text-2xl font-bold text-red-500">0</p>
            <p class="text-xs text-slate-500">Imported</p>
          </div>
          <div v-if="confirmResult && confirmResult.skipped > 0" class="text-center">
            <p class="text-2xl font-bold text-amber-500">{{ confirmResult.skipped }}</p>
            <p class="text-xs text-slate-500">Skipped</p>
          </div>
        </div>

        <!-- Skipped row errors -->
        <div
          v-if="confirmingError"
          class="mt-4 w-full max-w-sm rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-left"
        >
          <p class="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Row Errors</p>
          <div class="whitespace-pre-line text-xs text-amber-800 leading-relaxed">{{ confirmingError }}</div>
        </div>
      </div>
    </template>

    <!-- ======== Footer ======== -->
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <!-- Upload step: Cancel OR Cancel + Import (when file ready) -->
        <template v-if="currentStep === 'upload'">
          <BaseButton variant="secondary" class="!w-auto" @click="closeModal">
            Cancel
          </BaseButton>
          <BaseButton
            v-if="uploadResult"
            class="!w-auto"
            :disabled="validImportCount === 0 || checkingDuplicates"
            @click="handleConfirm"
          >
            <template v-if="checkingDuplicates">
              <svg class="-ml-1 mr-1.5 h-3.5 w-3.5 animate-spin inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking duplicates...
            </template>
            <template v-else>
              Import {{ validImportCount }} Candidate{{ validImportCount !== 1 ? 's' : '' }}
            </template>
          </BaseButton>
        </template>

        <!-- Confirming step: Cancel button -->
        <template v-else-if="currentStep === 'confirming'">
          <BaseButton variant="secondary" class="!w-auto" @click="closeModal">
            Cancel
          </BaseButton>
        </template>

        <!-- Done step: Close + View Candidates -->
        <template v-else-if="currentStep === 'done'">
          <BaseButton variant="secondary" class="!w-auto" @click="closeModal">
            Close
          </BaseButton>
          <BaseButton class="!w-auto" @click="closeModal">
            View Candidates →
          </BaseButton>
        </template>
      </div>
    </template>
  </BaseModal>
</template>
