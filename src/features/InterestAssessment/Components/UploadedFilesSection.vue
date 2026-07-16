<script setup lang="ts">
import type { UploadedDoc } from '../composables/useDocumentUpload'

defineProps<{
  docs: UploadedDoc[]
  isFileDraggingOver: boolean
  showSection: boolean
  hasUnaddedQuestions: boolean
  totalSize: string
}>()

const emit = defineEmits<{
  'toggle-section': []
  'open-file': [id: string]
  'remove-file': [id: string]
  'clear-all': []
  'add-to-form': [id: string]
  'add-all': []
  'file-dragover': [e: DragEvent]
  'file-dragleave': []
  'file-drop': [e: DragEvent]
  'trigger-input': []
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <div
    v-if="docs.length > 0 && showSection"
    class="overflow-hidden rounded-lg border border-slate-200"
  >
    <!-- Header -->
    <div
      class="flex cursor-pointer items-center justify-between bg-slate-50 px-4 py-2.5 transition hover:bg-slate-100"
      @click="emit('toggle-section')"
    >
      <div class="flex items-center gap-2">
        <svg class="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium text-slate-700">
          Uploaded files
          <span class="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{{ docs.length }}</span>
        </span>
        <span class="text-xs text-slate-400">({{ totalSize }})</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="hasUnaddedQuestions"
          type="button"
          class="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-600"
          @click.stop="emit('add-all')"
        >
          Add all to form
        </button>
        <button
          type="button"
          class="rounded px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-rose-500"
          @click.stop="emit('clear-all')"
        >
          Clear all
        </button>
        <svg class="h-4 w-4 text-slate-400 transition" :class="{ 'rotate-180': !showSection }" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Document list -->
    <div class="divide-y divide-slate-100 border-t border-slate-200">
      <div
        v-for="doc in docs"
        :key="doc.id"
        class="group relative px-4 py-3 transition hover:bg-slate-50"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <button type="button" class="shrink-0 cursor-pointer transition hover:scale-105" :title="`Open ${doc.name}`" @click="emit('open-file', doc.id)">
            <div class="flex items-center justify-center" style="width: 36px; height: 36px;">
              <svg v-if="doc.type.includes('pdf')" class="h-9 w-9" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#FEE2E2" /><text x="20" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#DC2626" font-family="system-ui">PDF</text></svg>
              <svg v-else-if="doc.type.includes('word') || doc.type.includes('doc')" class="h-9 w-9" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#DBEAFE" /><text x="20" y="22" text-anchor="middle" font-size="8" font-weight="bold" fill="#2563EB" font-family="system-ui">DOC</text></svg>
              <svg v-else-if="doc.type.includes('excel') || doc.type.includes('xls')" class="h-9 w-9" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#DCFCE7" /><text x="20" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#16A34A" font-family="system-ui">XLS</text></svg>
              <svg v-else-if="doc.type.includes('text')" class="h-9 w-9" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#F3E8FF" /><text x="20" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#9333EA" font-family="system-ui">TXT</text></svg>
              <svg v-else-if="doc.type.includes('image')" class="h-9 w-9" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#FEF3C7" /><circle cx="16" cy="15" r="3" fill="#D97706" /><path d="M10 28l6-8 4 5 4-7 6 10H10z" fill="#D97706" opacity="0.6" /></svg>
              <svg v-else class="h-9 w-9" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="4" fill="#F1F5F9" /><path d="M14 12h7l5 5v11a2 2 0 01-2 2H14a2 2 0 01-2-2V14a2 2 0 012-2z" fill="#94A3B8" opacity="0.5" /></svg>
            </div>
          </button>
          <!-- Info -->
          <div class="min-w-0 flex-1">
            <button type="button" class="flex w-full items-center gap-2 text-left" :title="`Open ${doc.name}`" @click="emit('open-file', doc.id)">
              <p class="truncate text-sm font-medium text-slate-800 transition hover:text-blue-600">{{ doc.name }}</p>
              <span class="shrink-0 text-xs text-slate-400">{{ formatSize(doc.size) }}</span>
            </button>
            <p class="mt-0.5 text-xs text-slate-400">
              {{ doc.type || 'Unknown type' }}
              <span v-if="doc.isProcessing" class="ml-2 text-amber-500">Processing...</span>
              <span v-if="doc.error" class="ml-2 text-rose-500">{{ doc.error }}</span>
            </p>
            <!-- Text preview -->
            <div v-if="doc.content && doc.content.length > 0" class="mt-2 max-h-24 overflow-y-auto rounded-md bg-slate-50 p-2.5 font-mono text-[11px] leading-relaxed text-slate-600">
              <div class="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-1.5">
                <svg class="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" /></svg>
                <span class="text-[10px] font-medium text-slate-500">Preview</span>
                <span class="text-[10px] text-slate-400">· {{ doc.content.length }} characters</span>
              </div>
              <div class="whitespace-pre-wrap break-words">{{ doc.content.substring(0, 500) }}{{ doc.content.length > 500 ? '...' : '' }}</div>
            </div>
            <!-- Parsed questions -->
            <div v-if="doc.parsedQuestions.length > 0" class="mt-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <svg class="h-3.5 w-3.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" /></svg>
                  <span class="text-xs font-semibold text-slate-700">{{ doc.parsedQuestions.length }} question{{ doc.parsedQuestions.length > 1 ? 's' : '' }} detected</span>
                  <span v-if="doc.questionsAdded" class="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">Added ✓</span>
                </div>
                <button
                  v-if="!doc.questionsAdded"
                  type="button"
                  class="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-600"
                  @click.stop="emit('add-to-form', doc.id)"
                >
                  Add to form
                </button>
              </div>
              <div class="mt-1.5 space-y-1">
                <div v-for="(pq, qi) in doc.parsedQuestions.slice(0, 5)" :key="qi" class="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs">
                  <span class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium" :class="{ 'bg-slate-100 text-slate-600': pq.type === 'short_text', 'bg-amber-50 text-amber-700': pq.type === 'single_choice', 'bg-purple-50 text-purple-700': pq.type === 'multi_choice' }">
                    {{ pq.type === 'short_text' ? 'Text' : pq.type === 'single_choice' ? 'Single' : 'Multi' }}
                  </span>
                  <span class="truncate text-slate-700">{{ pq.title }}</span>
                  <span v-if="pq.options" class="shrink-0 text-slate-400">({{ pq.options.length }} opt{{ pq.options.length > 1 ? 's' : '' }})</span>
                </div>
                <p v-if="doc.parsedQuestions.length > 5" class="px-2.5 text-[10px] text-slate-400">+ {{ doc.parsedQuestions.length - 5 }} more</p>
              </div>
            </div>
            <!-- Image preview -->
            <div v-if="doc.previewUrl" class="mt-2">
              <img :src="doc.previewUrl" :alt="doc.name" class="max-h-32 max-w-full rounded-md border border-slate-200 object-contain" />
            </div>
          </div>
          <!-- Remove button -->
          <button type="button" class="shrink-0 rounded-md p-1.5 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100" title="Remove file" @click="emit('remove-file', doc.id)">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Drop zone -->
    <div
      class="flex cursor-pointer items-center justify-center gap-2 border-t border-dashed border-slate-200 px-4 py-2.5 text-center transition-colors"
      :class="isFileDraggingOver ? 'border-blue-400 bg-blue-50' : 'hover:bg-slate-50'"
      @dragover="emit('file-dragover', $event)"
      @dragleave="emit('file-dragleave')"
      @drop="emit('file-drop', $event)"
      @click="emit('trigger-input')"
    >
      <svg class="h-3.5 w-3.5" :class="isFileDraggingOver ? 'text-blue-500' : 'text-slate-400'" viewBox="0 0 20 20" fill="none"><path d="M10 3v12m0 0l-4-4m4 4l4-4M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      <span class="text-xs font-medium" :class="isFileDraggingOver ? 'text-blue-600' : 'text-slate-500'">Drop more files or click to add</span>
    </div>
  </div>
</template>
