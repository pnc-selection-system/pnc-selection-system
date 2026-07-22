<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  uploaded: [file: File]
}>()

const isDragging = ref(false)

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('uploaded', file)
}

function handleChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('uploaded', file)
}
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-6">
    <label
      class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-14 text-center transition"
      :class="isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <svg class="h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <span class="text-sm text-slate-500">↓ Drop ZipGrade export here</span>
      <span class="text-xs text-slate-400">.csv or .xlsx · max 10 MB</span>
      <input type="file" accept=".csv,.xlsx" class="hidden" @change="handleChange" />
    </label>
  </div>
</template>
