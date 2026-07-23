<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import QuestionCard from './QuestionCard.vue'
import PassThresholdBar from './PassThresholdBar.vue'
import UploadedFilesSection from './UploadedFilesSection.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useDocumentUpload } from '../composables/useDocumentUpload'
import { QUESTION_TYPE_LABELS, type Question, type QuestionType } from '../types/question'

const props = defineProps<{
  formName: string
  questions: Question[]
  passThreshold: number
  selectedOptions: Record<string, string>
  selectedScales: Record<string, number>
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:questions': [value: Question[]]
  'update:passThreshold': [value: number]
  save: []
  'select-scale': [questionId: string, value: number]
  'select-option': [questionId: string, option: string]
  'add-question': [type: QuestionType]
}>()

const {
  uploadedDocs, isFileDraggingOver, showFileSection, fileInputRef,
  totalFileSize, hasUnaddedQuestions,
  handleFileDragOver, handleFileDragLeave, handleFileDrop, handleFileInputChange, triggerFileInput,
  openFile, removeFile, clearAllFiles,
  addParsedQuestionsToCanvas, addAllParsedQuestions,
} = useDocumentUpload()

// ── Question type dropdown ──
const questionTypes: QuestionType[] = ['short_text', 'single_choice', 'multi_choice', 'scale_1_5']
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() { showDropdown.value = !showDropdown.value }
function selectType(type: QuestionType) { emit('add-question', type); showDropdown.value = false }
function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) showDropdown.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// ── Delete confirm dialog ──
const showDeleteConfirm = ref(false)
const pendingDeleteIndex = ref<number | null>(null)
const pendingDeleteTitle = computed(() =>
  pendingDeleteIndex.value !== null ? (props.questions[pendingDeleteIndex.value]?.title || '') : '',
)
const deleteMessage = computed(() =>
  `Are you sure you want to drop the question "${pendingDeleteTitle.value}"? This cannot be undone.`,
)

function confirmRemoveQuestion(index: number) { pendingDeleteIndex.value = index; showDeleteConfirm.value = true }
function handleRemoveConfirmed() {
  if (pendingDeleteIndex.value === null) return
  const next = props.questions.filter((_, i) => i !== pendingDeleteIndex.value).map((q, i) => ({ ...q, order: i + 1 }))
  emit('update:questions', next); showDeleteConfirm.value = false; pendingDeleteIndex.value = null
}
function handleRemoveCancelled() { showDeleteConfirm.value = false; pendingDeleteIndex.value = null }

// ── Palette drag ──
const isPaletteDraggingOver = ref(false)
function handlePaletteDragOver(e: DragEvent) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; isPaletteDraggingOver.value = true }
function handlePaletteDragLeave() { isPaletteDraggingOver.value = false }
function handlePaletteDrop(e: DragEvent) {
  e.preventDefault(); isPaletteDraggingOver.value = false
  const pt = e.dataTransfer?.getData('application/question-type') as QuestionType | undefined
  if (pt && questionTypes.includes(pt)) emit('add-question', pt)
}

// ── Question reorder (drag within canvas) ──
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function handleQuestionDragStart(e: DragEvent, i: number) {
  draggedIndex.value = i; if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)) }
}
function handleQuestionDragOver(e: DragEvent, i: number) {
  e.preventDefault(); if (!e.dataTransfer) return
  const isPalette = e.dataTransfer.types.includes('application/question-type')
  e.dataTransfer.dropEffect = isPalette ? 'copy' : 'move'
  if (!isPalette && draggedIndex.value !== null && draggedIndex.value !== i) dragOverIndex.value = i
}
function handleQuestionDragLeave() { dragOverIndex.value = null }
function handleQuestionDrop(e: DragEvent, dropIndex: number) {
  e.preventDefault()
  const pt = e.dataTransfer?.getData('application/question-type') as QuestionType | undefined
  if (pt && questionTypes.includes(pt)) { emit('add-question', pt); return }
  const from = draggedIndex.value; dragOverIndex.value = null; draggedIndex.value = null
  if (from === null || from === dropIndex) return
  const reordered = [...props.questions]; const [moved] = reordered.splice(from, 1); reordered.splice(dropIndex, 0, moved)
  emit('update:questions', reordered.map((q, i) => ({ ...q, order: i + 1 })))
}
function handleQuestionDragEnd() { draggedIndex.value = null; dragOverIndex.value = null }

// ── Question CRUD ──
function updateQuestion(index: number, question: Question) {
  emit('update:questions', props.questions.map((q, i) => (i === index ? question : q)))
}
function handleSaveClick() { emit('save') }

// ── Helpers for document composable ──
function handleAddToForm(docId: string) {
  addParsedQuestionsToCanvas(docId, props.questions.length, (newQ: Question[]) => {
    emit('update:questions', [...props.questions, ...newQ])
  })
}
function handleAddAll() {
  addAllParsedQuestions(props.questions.length, (newQ: Question[]) => {
    emit('update:questions', [...props.questions, ...newQ])
  })
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Form canvas · "{{ formName }}"
      </p>
      <div ref="dropdownRef" class="relative">
        <BaseButton variant="secondary" size="small" class="!w-auto !border-dashed" @click="toggleDropdown">
          + Add question
          <svg class="ml-1 h-3 w-3 transition" :class="{ 'rotate-180': showDropdown }" viewBox="0 0 20 20" fill="none">
            <path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </BaseButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div v-if="showDropdown" class="absolute right-0 top-full z-50 mt-1 w-44 origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            <button v-for="t in questionTypes" :key="t" type="button" class="flex w-full items-center px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900" @click="selectType(t)">
              <span class="font-medium">{{ QUESTION_TYPE_LABELS[t] }}</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Hidden file input -->
    <input ref="fileInputRef" type="file" class="hidden" multiple accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.svg" @change="handleFileInputChange" />

    <div class="mt-4 space-y-3">
      <!-- Empty state -->
      <div
        v-if="questions.length === 0 && uploadedDocs.length === 0"
        class="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
        :class="isPaletteDraggingOver || isFileDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
        @dragover="(e) => { handlePaletteDragOver(e); handleFileDragOver(e) }"
        @dragleave="(e) => { handlePaletteDragLeave(); handleFileDragLeave() }"
        @drop="(e) => { handlePaletteDrop(e); handleFileDrop(e) }"
        @click="triggerFileInput"
      >
        <svg class="mx-auto h-12 w-12 text-slate-300" viewBox="0 0 20 20" fill="none"><path d="M10 3v12m0 0l-4-4m4 4l4-4M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <p class="mt-2 text-sm font-medium" :class="isPaletteDraggingOver || isFileDraggingOver ? 'text-blue-600' : 'text-slate-400'">
          {{ isPaletteDraggingOver || isFileDraggingOver ? 'Drop to add' : '+ drop question or document here' }}
        </p>
        <p class="mt-1 text-xs text-slate-400">Drag questions from the left panel or drop documents</p>
      </div>

      <!-- Uploaded files section -->
      <UploadedFilesSection
        :docs="uploadedDocs"
        :is-file-dragging-over="isFileDraggingOver"
        :show-section="showFileSection"
        :has-unadded-questions="hasUnaddedQuestions"
        :total-size="totalFileSize"
        @toggle-section="showFileSection = !showFileSection"
        @open-file="openFile"
        @remove-file="removeFile"
        @clear-all="clearAllFiles"
        @add-to-form="handleAddToForm"
        @add-all="handleAddAll"
        @file-dragover="handleFileDragOver"
        @file-dragleave="handleFileDragLeave"
        @file-drop="handleFileDrop"
        @trigger-input="triggerFileInput"
      />

      <!-- Questions list -->
      <template v-if="questions.length > 0">
        <div class="space-y-3">
          <div v-for="(question, i) in questions" :key="question.id" draggable="true" class="relative"
            @dragstart="handleQuestionDragStart($event, i)"
            @dragover="handleQuestionDragOver($event, i)"
            @dragleave="handleQuestionDragLeave"
            @drop="handleQuestionDrop($event, i)"
            @dragend="handleQuestionDragEnd"
          >
            <QuestionCard
              :question="question" :index="i"
              :selected-option="selectedOptions[question.id] || ''"
              :selected-scale="selectedScales[question.id] || 0"
              :is-dragging="draggedIndex === i"
              :is-drop-target="dragOverIndex === i"
              @update:question="updateQuestion(i, $event)"
              @remove="confirmRemoveQuestion(i)"
              @select-scale="(v: number) => emit('select-scale', question.id, v)"
              @select-option="(opt: string) => emit('select-option', question.id, opt)"
            />
          </div>
        </div>
        <!-- Drop zone -->
        <div
          class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-center transition-colors"
          :class="isPaletteDraggingOver || isFileDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
          @dragover="(e) => { handlePaletteDragOver(e); handleFileDragOver(e) }"
          @dragleave="(e) => { handlePaletteDragLeave(); handleFileDragLeave() }"
          @drop="(e) => { handlePaletteDrop(e); handleFileDrop(e) }"
          @click="triggerFileInput"
        >
          <svg class="h-4 w-4" :class="isPaletteDraggingOver || isFileDraggingOver ? 'text-blue-500' : 'text-slate-400'" viewBox="0 0 20 20" fill="none"><path d="M10 3v12m0 0l-4-4m4 4l4-4M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span class="text-sm font-medium" :class="isPaletteDraggingOver || isFileDraggingOver ? 'text-blue-600' : 'text-slate-500'">
            {{ isPaletteDraggingOver || isFileDraggingOver ? 'Drop to add' : '+ drop question or document here' }}
          </span>
        </div>
      </template>
    </div>

    <PassThresholdBar :model-value="passThreshold" :saving="saving" @update:model-value="emit('update:passThreshold', $event)" @save="handleSaveClick" />

    <ConfirmDialog
      :model-value="showDeleteConfirm" title="Drop question" :message="deleteMessage"
      confirm-text="Drop" cancel-text="Cancel"
      @confirm="handleRemoveConfirmed" @cancel="handleRemoveCancelled"
      @update:model-value="(v: boolean) => { if (!v) handleRemoveCancelled() }"
    />
  </div>
</template>
