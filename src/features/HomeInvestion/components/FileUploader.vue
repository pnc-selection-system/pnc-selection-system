<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  accept?: string
  maxSize?: number
}>()

const emit = defineEmits<{
  upload: [file: File]
}>()

const dragging = ref(false)
const uploading = ref(false)
const progress = ref(0)
const preview = ref<string | null>(null)
const error = ref<string | null>(null)
const success = ref(false)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

function handleFile(file: File) {
  error.value = null
  success.value = false

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    error.value = 'File size must be less than 5MB'
    return
  }

  if (file.type.startsWith('image/')) {
    preview.value = URL.createObjectURL(file)
  }

  uploading.value = true
  progress.value = 0

  const interval = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(interval)
      uploading.value = false
      success.value = true
      emit('upload', file)
      setTimeout(() => {
        success.value = false
        progress.value = 0
      }, 2000)
    }
  }, 200)
}

function removePreview() {
  if (preview.value) {
    URL.revokeObjectURL(preview.value)
  }
  preview.value = null
  error.value = null
  success.value = false
}
</script>

<template>
  <div class="w-full">
    <div
      class="relative rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors"
      :class="{ 'border-blue-400 bg-blue-50': dragging }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        type="file"
        class="absolute inset-0 cursor-pointer opacity-0"
        :accept="accept || 'image/*,.pdf'"
        @change="handleInput"
      />

      <div v-if="!preview && !uploading && !success" class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v12m0 0v4m0-4H36m-4 4h4m-4-4h4m-4 4h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="text-sm text-slate-600">
          <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
        </div>
        <p class="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
      </div>

      <div v-else-if="uploading" class="space-y-2">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p class="text-sm text-slate-600">Uploading... {{ progress }}%</p>
        <div class="mx-auto h-2 w-full max-w-xs rounded-full bg-slate-200">
          <div class="h-2 rounded-full bg-blue-600 transition-all" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>

      <div v-else-if="success" class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium text-green-600">Upload successful!</p>
      </div>

      <div v-else-if="preview" class="space-y-2">
        <img :src="preview" alt="Preview" class="mx-auto max-h-32 rounded-lg" />
        <button
          type="button"
          class="text-sm text-red-600 hover:text-red-700"
          @click="removePreview"
        >
          Remove
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
  </div>
</template>