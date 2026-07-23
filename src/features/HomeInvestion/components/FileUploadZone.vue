<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  upload: [file: File]
}>()

const dragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const error = ref<string | null>(null)

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function handleDragOver(e: DragEvent) {
  if (props.disabled) return
  e.preventDefault()
  e.stopPropagation()
  dragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  dragging.value = false
}

function handleDrop(e: DragEvent) {
  if (props.disabled) return
  e.preventDefault()
  e.stopPropagation()
  dragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    validateAndUpload(files[0])
  }
}

function handleInput(e: Event) {
  if (props.disabled) return
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    validateAndUpload(files[0])
  }
  target.value = ''
}

function validateAndUpload(file: File) {
  error.value = null

  if (file.size > MAX_SIZE) {
    error.value = `File size exceeds 10 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB)`
    return
  }

  const ext = file.name.split('.').pop()?.toLowerCase()
  const isImage = file.type.startsWith('image/')
  const isPdf = ext === 'pdf' || file.type === 'application/pdf'
  const isDocx = ext === 'docx' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  if (!isImage && !isPdf && !isDocx) {
    error.value = 'Only images (JPG, PNG, GIF, WebP), PDF, and DOCX files are allowed'
    return
  }

  // Simulate upload progress
  uploading.value = true
  progress.value = 0

  const interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 20) + 5
    if (progress.value >= 100) {
      clearInterval(interval)
      progress.value = 100
      setTimeout(() => {
        uploading.value = false
        progress.value = 0
        emit('upload', file)
      }, 300)
    }
  }, 200)
}
</script>

<template>
  <div>
    <div
      class="relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200"
      :class="[
        disabled
          ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
          : dragging
            ? 'scale-[1.01] border-cyan-400 bg-cyan-50 shadow-[0_0_0_3px_rgba(6,182,212,0.15)]'
            : 'border-slate-300 bg-slate-50/30 hover:border-cyan-300 hover:bg-cyan-50/20 hover:shadow-sm',
      ]"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        type="file"
        class="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        :accept="'.jpg,.jpeg,.png,.gif,.webp,.pdf,.docx'"
        :disabled="disabled"
        @change="handleInput"
      />

      <!-- Idle state -->
      <div v-if="!uploading" class="space-y-3">
        <div class="flex justify-center">
          <div
            class="rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 p-3.5 shadow-sm transition-all duration-200"
            :class="{ 'scale-110': dragging }"
          >
            <svg class="h-7 w-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-700">
            <span class="text-cyan-600 underline underline-offset-2 decoration-cyan-300 decoration-2 hover:decoration-cyan-500">Click to upload</span>
            <span v-if="!disabled" class="text-slate-500"> or drag and drop</span>
          </p>
          <p class="mt-1 text-xs text-slate-400">
            JPG, PNG, GIF, WebP, PDF, DOCX &middot; <span class="font-medium">Max 10 MB</span>
          </p>
        </div>
      </div>

      <!-- Uploading state -->
      <div v-else class="space-y-4">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 shadow-sm">
          <svg class="h-6 w-6 animate-spin text-cyan-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-700">Uploading... <span class="text-cyan-600">{{ progress }}%</span></p>
          <div class="mx-auto mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
            <div
              class="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 shadow-sm"
    >
      <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ error }}
    </div>
  </div>
</template>
