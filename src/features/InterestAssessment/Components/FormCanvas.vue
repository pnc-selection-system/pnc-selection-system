<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import QuestionCard from './QuestionCard.vue'
import PassThresholdBar from './PassThresholdBar.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
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

const questionTypes: QuestionType[] = ['short_text', 'single_choice', 'multi_choice', 'scale_1_5']
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Confirm dialog before dropping a question
const showDeleteConfirm = ref(false)
const pendingDeleteIndex = ref<number | null>(null)
const pendingDeleteTitle = computed(() => {
  if (pendingDeleteIndex.value === null) return ''
  return props.questions[pendingDeleteIndex.value]?.title || ''
})

const deleteMessage = computed(() => {
  const title = pendingDeleteTitle.value
  return `Are you sure you want to drop the question "${title}"? This cannot be undone.`
})

// Drag from palette
const isPaletteDraggingOver = ref(false)

// File drag and drop
const isFileDraggingOver = ref(false)
const uploadedFiles = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

// Drag to reorder within canvas
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectType(type: QuestionType) {
  emit('add-question', type)
  showDropdown.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ── Palette drag → add new question ──
function handlePaletteDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
  isPaletteDraggingOver.value = true
}

function handlePaletteDragLeave() {
  isPaletteDraggingOver.value = false
}

// ── File drop handlers ──
function handleFileDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
  isFileDraggingOver.value = true
}

function handleFileDragLeave() {
  isFileDraggingOver.value = false
}

function handleFileDrop(event: DragEvent) {
  event.preventDefault()
  isFileDraggingOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFiles(files)
  }
}

function handleFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFiles(files)
  }
  // Reset input so same file can be selected again
  if (target.value) target.value = ''
}

function processFiles(files: FileList) {
  uploadedFiles.value = Array.from(files)
  console.log('Files uploaded:', uploadedFiles.value)
  
  // Process each file
  Array.from(files).forEach(file => {
    console.log('Processing file:', file.name, file.type, file.size)
    // TODO: Add file processing logic here
    // - Upload to server
    // - Extract questions from document
    // - Parse PDF/Word document
  })
  
  // Show success message
  ElMessage.success(`Successfully uploaded ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`)
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handlePaletteDrop(event: DragEvent) {
  event.preventDefault()
  isPaletteDraggingOver.value = false
  const questionType = event.dataTransfer?.getData('application/question-type') as QuestionType | undefined
  if (questionType && questionTypes.includes(questionType)) {
    emit('add-question', questionType)
  }
}

// ── Reorder questions within canvas ──
function handleQuestionDragStart(event: DragEvent, index: number) {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function handleQuestionDragOver(event: DragEvent, index: number) {
  event.preventDefault()
  if (!event.dataTransfer) return

  // Check if this is a palette drag (add) vs canvas drag (move)
  const isPaletteDrag = event.dataTransfer.types.includes('application/question-type')
  event.dataTransfer.dropEffect = isPaletteDrag ? 'copy' : 'move'

  // Only show drop target indicator for canvas reorder (not palette add)
  if (!isPaletteDrag && draggedIndex.value !== null && draggedIndex.value !== index) {
    dragOverIndex.value = index
  }
}

function handleQuestionDragLeave() {
  dragOverIndex.value = null
}

function handleQuestionDrop(event: DragEvent, dropIndex: number) {
  event.preventDefault()

  // Check if this is a palette drag (add new question)
  const paletteType = event.dataTransfer?.getData('application/question-type') as QuestionType | undefined
  if (paletteType && questionTypes.includes(paletteType)) {
    emit('add-question', paletteType)
    return
  }

  // Reorder existing question
  const fromIndex = draggedIndex.value
  dragOverIndex.value = null
  draggedIndex.value = null

  if (fromIndex === null || fromIndex === dropIndex) return

  const reordered = [...props.questions]
  const [moved] = reordered.splice(fromIndex, 1)
  reordered.splice(dropIndex, 0, moved)

  // Reassign order numbers
  const updated = reordered.map((q, i) => ({ ...q, order: i + 1 }))
  emit('update:questions', updated)
}

function handleQuestionDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
}

function updateQuestion(index: number, question: Question) {
  const next = props.questions.map((q, i) => (i === index ? question : q))
  emit('update:questions', next)
}

function confirmRemoveQuestion(index: number) {
  pendingDeleteIndex.value = index
  showDeleteConfirm.value = true
}

function handleRemoveConfirmed() {
  if (pendingDeleteIndex.value === null) return
  const next = props.questions.filter((_, i) => i !== pendingDeleteIndex.value).map((q, i) => ({ ...q, order: i + 1 }))
  emit('update:questions', next)
  showDeleteConfirm.value = false
  pendingDeleteIndex.value = null
}

function handleRemoveCancelled() {
  showDeleteConfirm.value = false
  pendingDeleteIndex.value = null
}

function handleScaleSelect(questionId: string, value: number) {
  emit('select-scale', questionId, value)
}

function handleOptionSelect(questionId: string, option: string) {
  emit('select-option', questionId, option)
}

function handleSaveClick() {
  emit('save')
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
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
          <div
            v-if="showDropdown"
            class="absolute right-0 top-full z-50 mt-1 w-44 origin-top-right overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            <button
              v-for="t in questionTypes"
              :key="t"
              type="button"
              class="flex w-full items-center px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              @click="selectType(t)"
            >
              <span class="font-medium">{{ QUESTION_TYPE_LABELS[t] }}</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      multiple
      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
      @change="handleFileInputChange"
    />

    <div class="mt-4 space-y-3">
      <!-- Empty state: accepts drops from palette and files -->
      <div
        v-if="questions.length === 0"
        class="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
        :class="isPaletteDraggingOver || isFileDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
        @dragover="(e) => { handlePaletteDragOver(e); handleFileDragOver(e); }"
        @dragleave="(e) => { handlePaletteDragLeave(); handleFileDragLeave(); }"
        @drop="(e) => { handlePaletteDrop(e); handleFileDrop(e); }"
        @click="triggerFileInput"
      >
        <svg class="mx-auto h-12 w-12 text-slate-300" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v12m0 0l-4-4m4 4l4-4M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="mt-2 text-sm font-medium" :class="isPaletteDraggingOver || isFileDraggingOver ? 'text-blue-600' : 'text-slate-400'">
          {{ isPaletteDraggingOver || isFileDraggingOver ? 'Drop to add' : '+ drop question or document here' }}
        </p>
        <p class="mt-1 text-xs text-slate-400">Drag questions from the left panel or drop documents</p>
      </div>

      <!-- Questions list with drag-to-reorder -->
      <template v-else>
        <div class="space-y-3">
          <div
            v-for="(question, i) in questions"
            :key="question.id"
            draggable="true"
            class="relative"
            @dragstart="handleQuestionDragStart($event, i)"
            @dragover="handleQuestionDragOver($event, i)"
            @dragleave="handleQuestionDragLeave"
            @drop="handleQuestionDrop($event, i)"
            @dragend="handleQuestionDragEnd"
          >
            <QuestionCard
              :question="question"
              :index="i"
              :selected-option="selectedOptions[question.id] || ''"
              :selected-scale="selectedScales[question.id] || 0"
              :is-dragging="draggedIndex === i"
              :is-drop-target="dragOverIndex === i"
              @update:question="updateQuestion(i, $event)"
              @remove="confirmRemoveQuestion(i)"
              @select-scale="handleScaleSelect(question.id, $event)"
              @select-option="handleOptionSelect"
            />
          </div>
        </div>

        <!-- Drop zone at the bottom for palette drags and files -->
        <div
          class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-center transition-colors"
          :class="isPaletteDraggingOver || isFileDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
          @dragover="(e) => { handlePaletteDragOver(e); handleFileDragOver(e); }"
          @dragleave="(e) => { handlePaletteDragLeave(); handleFileDragLeave(); }"
          @drop="(e) => { handlePaletteDrop(e); handleFileDrop(e); }"
          @click="triggerFileInput"
        >
          <svg class="h-4 w-4" :class="isPaletteDraggingOver || isFileDraggingOver ? 'text-blue-500' : 'text-slate-400'" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v12m0 0l-4-4m4 4l4-4M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text-sm font-medium" :class="isPaletteDraggingOver || isFileDraggingOver ? 'text-blue-600' : 'text-slate-500'">
            {{ isPaletteDraggingOver || isFileDraggingOver ? 'Drop to add' : '+ drop question or document here' }}
          </span>
        </div>
      </template>
    </div>

    <PassThresholdBar
      :model-value="passThreshold"
      :saving="saving"
      @update:model-value="emit('update:passThreshold', $event)"
      @save="handleSaveClick"
    />

    <ConfirmDialog
      :model-value="showDeleteConfirm"
      title="Drop question"
      :message="deleteMessage"
      confirm-text="Drop"
      cancel-text="Cancel"
      @confirm="handleRemoveConfirmed"
      @cancel="handleRemoveCancelled"
      @update:model-value="(v: boolean) => { if (!v) handleRemoveCancelled() }"
    />
  </div>
</template>
