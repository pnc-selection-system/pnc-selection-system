<script setup lang="ts">
import { ref } from 'vue'
import type { Candidate } from '../types/index'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'import', candidates: Omit<Candidate, 'id'>[]): void
}>()

const selectedFile = ref<File | null>(null)
const dragOver = ref(false)
const parseResult = ref<{ count: number; errors: string[] } | null>(null)
const parsing = ref(false)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
    parseFile(input.files[0])
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  dragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    parseFile(files[0])
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

function parseFile(file: File) {
  parsing.value = true
  const errors: string[] = []

  if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    errors.push('Only CSV and Excel files are supported')
    parseResult.value = { count: 0, errors }
    parsing.value = false
    return
  }

  // Simulate parsing - in production, use a library like xlsx or Papa Parse
  setTimeout(() => {
    parseResult.value = { count: 0, errors }
    parsing.value = false
  }, 1000)
}

function handleImport() {
  if (!parseResult.value || parseResult.value.errors.length > 0) return

  // In production, parse the actual file and emit candidates
  emit('import', [])
  closeModal()
}

function closeModal() {
  selectedFile.value = null
  parseResult.value = null
  parsing.value = false
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="closeModal"
      />

      <!-- Modal -->
      <div class="relative w-full max-w-[560px] rounded-xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-slate-900">Bulk Import Candidates</h2>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            @click="closeModal"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5">
          <!-- Drop Zone -->
          <div
            class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors"
            :class="[
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400',
            ]"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
          >
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              class="hidden"
              id="file-upload"
              @change="handleFileSelect"
            />

            <div v-if="!selectedFile" class="text-center">
              <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mt-2 text-sm text-slate-600">
                Drag and drop your file here, or
                <label
                  for="file-upload"
                  class="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                >
                  browse
                </label>
              </p>
              <p class="mt-1 text-xs text-slate-400">Supports CSV, XLSX, XLS files</p>
            </div>

            <div v-else class="flex items-center gap-3">
              <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-slate-700">{{ selectedFile.name }}</p>
                <p class="text-xs text-slate-400">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
              </div>
            </div>
          </div>

          <!-- Parse Status -->
          <div v-if="parsing" class="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Parsing file...
          </div>

          <div v-if="parseResult && !parsing" class="mt-4">
            <div v-if="parseResult.errors.length > 0" class="rounded-lg bg-red-50 p-3">
              <p class="text-sm font-medium text-red-700">Import errors:</p>
              <ul class="mt-1 list-inside list-disc text-xs text-red-600">
                <li v-for="(err, i) in parseResult.errors" :key="i">{{ err }}</li>
              </ul>
            </div>
            <div v-else class="rounded-lg bg-green-50 p-3">
              <p class="text-sm text-green-700">
                Ready to import. Duplicate detection will flag name + DOB + province matches.
              </p>
            </div>
          </div>

          <p class="mt-4 text-xs text-slate-400">
            The imported file should have columns: Full Name, Gender, Date of Birth, Phone, Province, NGO, Status, Address.
          </p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!selectedFile || parsing || (parseResult?.errors.length ?? 0) > 0"
            @click="handleImport"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
