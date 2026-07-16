<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import QuestionCard from './QuestionCard.vue'
import PassThresholdBar from './PassThresholdBar.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { QUESTION_TYPE_LABELS, type Question, type QuestionType } from '../types/question'

interface UploadedDoc {
  id: string
  name: string
  type: string
  size: number
  content: string | null // text content for text-based files
  previewUrl: string | null // object URL for preview (images, pdfs)
  fileRef: File | null // original file reference for download/open
  isProcessing: boolean
  error: string | null
  parsedQuestions: Question[] // questions extracted from document
  questionsAdded: boolean // whether parsed questions have been added to canvas
}

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
const uploadedDocs = ref<UploadedDoc[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const showFileSection = ref(true)

// Drag to reorder within canvas
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const totalFileSize = computed(() => {
  const total = uploadedDocs.value.reduce((sum, doc) => sum + doc.size, 0)
  return formatFileSize(total)
})

const hasUnaddedQuestions = computed(() =>
  uploadedDocs.value.some(doc => doc.parsedQuestions.length > 0 && !doc.questionsAdded),
)

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
  // Cleanup object URLs
  uploadedDocs.value.forEach(doc => {
    if (doc.previewUrl) URL.revokeObjectURL(doc.previewUrl)
  })
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string): string {
  if (type.includes('pdf')) return 'pdf'
  if (type.includes('word') || type.includes('doc')) return 'word'
  if (type.includes('excel') || type.includes('spreadsheet') || type.includes('xls')) return 'excel'
  if (type.includes('text') || type.includes('txt')) return 'text'
  if (type.includes('image')) return 'image'
  return 'generic'
}

function isTextBased(type: string): boolean {
  return type.includes('text') || type.includes('txt')
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

async function readFileContent(file: File): Promise<string | null> {
  if (isTextBased(file.type)) {
    try {
      return await file.text()
    } catch {
      return null
    }
  }
  return null
}

// ── Question parsing from document text ──

// Detect if a line looks like a question title
function isQuestionLine(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed) return false
  // Ends with ?
  if (trimmed.endsWith('?')) return true
  // Starts with number pattern like "1.", "1)", "Q1", "Question 1"
  if (/^\s*(?:Q(?:uestion)?\s*)?\d+[.)]/.test(trimmed)) return true
  // Ends with colon (like "What is your name:")
  if (trimmed.endsWith(':') && trimmed.length > 5) return true
  // Contains common question words and ends with punctuation
  if (/\b(?:what|why|how|when|where|which|who|describe|explain|list|select|choose|rate|rank)\b/i.test(trimmed) && /[?:]$/.test(trimmed)) return true
  return false
}

function isSingleChoiceOption(line: string): boolean {
  const trimmed = line.trim()
  // Radio-style: ○, ( ), (a), a., etc.
  return /^[○\u25CB]\s/.test(trimmed) ||
    /^\(\s?\)\s/.test(trimmed) ||
    /^\([a-z]\)\s/.test(trimmed) ||
    /^[a-z][.)]\s/.test(trimmed) ||
    /^-\s/.test(trimmed) ||
    /^•\s/.test(trimmed) ||
    /^\*\s/.test(trimmed)
}

function isMultiChoiceOption(line: string): boolean {
  const trimmed = line.trim()
  // Checkbox-style: ☐, □, [ ], [x]
  return /^[☐□\u2610\u2611]\s/.test(trimmed) ||
    /^\[\s?\]\s/.test(trimmed) ||
    /^\[x\]\s/i.test(trimmed) ||
    /^\[X\]\s/.test(trimmed)
}

function cleanOptionText(line: string): string {
  return line.trim()
    .replace(/^[○\u25CB\)\s]/, '')
    .replace(/^\(\s?\)\s*/, '')
    .replace(/^\([a-z]\)\s*/i, '')
    .replace(/^[a-z][.)]\s*/i, '')
    .replace(/^[☐□\u2610\u2611]\s*/, '')
    .replace(/^\[\s?\]\s*\s*/, '')
    .replace(/^\[x\]\s*/i, '')
    .replace(/^[-•*]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .trim()
}

function cleanQuestionTitle(line: string): string {
  return line.trim()
    .replace(/^Q(?:uestion)?\s*\d+[.)]\s*/i, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/[:?]+$/, '')
    .trim()
}

function parseQuestionsFromText(text: string): Question[] {
  const lines = text.split('\n')
  const questions: Question[] = []
  
  let currentQuestion: Partial<Question> | null = null
  let currentOptions: string[] = []
  let optionType: 'single' | 'multi' | null = null
  
  function flushQuestion() {
    if (!currentQuestion) return
    
    if (currentOptions.length > 0) {
      // Has options → single or multi choice
      currentQuestion.type = optionType === 'multi' ? 'multi_choice' : 'single_choice'
      currentQuestion.options = [...currentOptions]
    } else {
      // No options → short text
      currentQuestion.type = 'short_text'
    }
    
    questions.push({
      id: `parsed_${Date.now()}_${questions.length}`,
      order: questions.length + 1,
      title: currentQuestion.title || 'Untitled question',
      type: currentQuestion.type as QuestionType,
      weight: 1,
      options: currentQuestion.options,
    } as Question)
    
    currentOptions = []
    optionType = null
    currentQuestion = null
  }
  
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      // Empty line = potential question separator, but don't flush yet
      continue
    }
    
    if (isQuestionLine(line)) {
      // Flush previous question if exists
      if (currentQuestion) {
        flushQuestion()
      }
      currentQuestion = {
        title: cleanQuestionTitle(line),
      }
      currentOptions = []
      optionType = null
    } else if (isMultiChoiceOption(line)) {
      if (!currentQuestion) {
        currentQuestion = { title: 'Question' }
      }
      optionType = 'multi'
      currentOptions.push(cleanOptionText(line))
    } else if (isSingleChoiceOption(line)) {
      if (!currentQuestion) {
        currentQuestion = { title: 'Question' }
      }
      if (optionType !== 'multi') {
        optionType = 'single'
      }
      currentOptions.push(cleanOptionText(line))
    } else if (line && currentQuestion && currentOptions.length > 0) {
      // Only capture content as an option if it:
      // - Follows a question that already has options
      // - Is short enough (likely an option, not a description)
      // - Doesn't end with a period (likely an option text, not a sentence)
      // - Doesn't look like a numbered item from the document
      if (
        line.length < 60 &&
        !line.endsWith('.') &&
        !line.endsWith(':') &&
        !/^\d+[.)]/.test(line)
      ) {
        currentOptions.push(line)
      }
    }
  }
  
  // Flush last question
  if (currentQuestion) {
    flushQuestion()
  }
  
  return questions
}

async function processFiles(fileList: FileList) {
  const files = Array.from(fileList)
  const newDocs: UploadedDoc[] = []
  
  for (const file of files) {
    const doc: UploadedDoc = {
      id: generateFileId(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: null,
      previewUrl: null,
      fileRef: file,
      isProcessing: true,
      error: null,
      parsedQuestions: [],
      questionsAdded: false,
    }
    newDocs.push(doc)
    
    try {
      // Read text content for text-based files
      if (isTextBased(file.type)) {
        doc.content = await readFileContent(file)
        
        // Auto-parse questions from text content
        if (doc.content && doc.content.trim()) {
          const parsed = parseQuestionsFromText(doc.content)
          if (parsed.length > 0) {
            doc.parsedQuestions = parsed
          }
        }
      }
      
      // Create preview URL for images
      if (file.type.includes('image')) {
        doc.previewUrl = URL.createObjectURL(file)
      }
      
      doc.isProcessing = false
    } catch (err) {
      doc.isProcessing = false
      doc.error = 'Failed to read file'
    }
  }
  
  uploadedDocs.value = [...uploadedDocs.value, ...newDocs]
  showFileSection.value = true
  
  // Show success message with file names and detected question count
  const names = newDocs.map(d => d.name).join(', ')
  const totalParsed = newDocs.reduce((sum, d) => sum + d.parsedQuestions.length, 0)
  if (totalParsed > 0) {
    ElMessage.success(`Parsed ${totalParsed} question(s) from ${newDocs.length} file(s)`)
  } else {
    ElMessage.success(`Uploaded ${newDocs.length} file(s): ${names}`)
  }
}

function addParsedQuestionsToCanvas(docId: string) {
  const doc = uploadedDocs.value.find(d => d.id === docId)
  if (!doc || doc.parsedQuestions.length === 0 || doc.questionsAdded) return
  
  const existingCount = props.questions.length
  const newQuestions = doc.parsedQuestions.map((q, i) => ({
    ...q,
    id: `q_from_doc_${docId}_${i}`,
    order: existingCount + i + 1,
  }))
  
  emit('update:questions', [...props.questions, ...newQuestions])
  doc.questionsAdded = true
  ElMessage.success(`Added ${newQuestions.length} question(s) from "${doc.name}" to the form`)
}

function addAllParsedQuestions() {
  let allNew: Question[] = []
  let docCount = 0
  
  for (const doc of uploadedDocs.value) {
    if (doc.parsedQuestions.length > 0 && !doc.questionsAdded) {
      const existingCount = props.questions.length + allNew.length
      const newQs = doc.parsedQuestions.map((q, i) => ({
        ...q,
        id: `q_from_doc_${doc.id}_${i}`,
        order: existingCount + i + 1,
      }))
      allNew = [...allNew, ...newQs]
      doc.questionsAdded = true
      docCount++
    }
  }
  
  if (allNew.length > 0) {
    emit('update:questions', [...props.questions, ...allNew])
    ElMessage.success(`Added ${allNew.length} question(s) from ${docCount} document(s)`)
  }
}

function removeFile(docId: string) {
  const doc = uploadedDocs.value.find(d => d.id === docId)
  if (doc?.previewUrl) {
    URL.revokeObjectURL(doc.previewUrl)
  }
  uploadedDocs.value = uploadedDocs.value.filter(d => d.id !== docId)
  
  if (uploadedDocs.value.length === 0) {
    showFileSection.value = true
  }
}

function clearAllFiles() {
  uploadedDocs.value.forEach(doc => {
    if (doc.previewUrl) URL.revokeObjectURL(doc.previewUrl)
  })
  uploadedDocs.value = []
  ElMessage.info('All files removed')
}

function openFile(docId: string) {
  const doc = uploadedDocs.value.find(d => d.id === docId)
  if (!doc || !doc.fileRef) return
  
  // Create an object URL from the original file and open it
  const url = URL.createObjectURL(doc.fileRef)
  window.open(url, '_blank')
  // Revoke the URL after a delay so the browser can load it
  setTimeout(() => URL.revokeObjectURL(url), 10000)
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
      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.svg"
      @change="handleFileInputChange"
    />

    <div class="mt-4 space-y-3">
      <!-- Empty state: accepts drops from palette and files -->
      <div
        v-if="questions.length === 0 && uploadedDocs.length === 0"
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

      <!-- Uploaded Documents Section -->
      <div
        v-if="uploadedDocs.length > 0 && showFileSection"
        class="overflow-hidden rounded-lg border border-slate-200"
      >
        <div
          class="flex cursor-pointer items-center justify-between bg-slate-50 px-4 py-2.5 transition hover:bg-slate-100"
          @click="showFileSection = !showFileSection"
        >
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium text-slate-700">
              Uploaded files
              <span class="ml-1.5 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">{{ uploadedDocs.length }}</span>
            </span>
            <span class="text-xs text-slate-400">({{ totalFileSize }})</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="hasUnaddedQuestions"
              type="button"
              class="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-600"
              @click.stop="addAllParsedQuestions"
            >
              Add all to form
            </button>
            <button
              type="button"
              class="rounded px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-rose-500"
              @click.stop="clearAllFiles"
            >
              Clear all
            </button>
            <svg
              class="h-4 w-4 text-slate-400 transition"
              :class="{ 'rotate-180': !showFileSection }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div class="divide-y divide-slate-100 border-t border-slate-200">
          <div
            v-for="doc in uploadedDocs"
            :key="doc.id"
            class="group relative px-4 py-3 transition hover:bg-slate-50"
          >
            <div class="flex items-start gap-3">
              <!-- File type icon (clickable to open file) -->
              <button
                type="button"
                class="shrink-0 cursor-pointer transition hover:scale-105"
                :title="`Open ${doc.name}`"
                @click="openFile(doc.id)"
              >
                <div class="flex items-center justify-center" style="width: 36px; height: 36px;">
                  <!-- PDF icon -->
                  <svg v-if="getFileIcon(doc.type) === 'pdf'" class="h-9 w-9" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="4" fill="#FEE2E2" />
                    <text x="20" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#DC2626" font-family="system-ui">PDF</text>
                  </svg>
                  <!-- Word icon -->
                  <svg v-else-if="getFileIcon(doc.type) === 'word'" class="h-9 w-9" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="4" fill="#DBEAFE" />
                    <text x="20" y="22" text-anchor="middle" font-size="8" font-weight="bold" fill="#2563EB" font-family="system-ui">DOC</text>
                  </svg>
                  <!-- Excel icon -->
                  <svg v-else-if="getFileIcon(doc.type) === 'excel'" class="h-9 w-9" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="4" fill="#DCFCE7" />
                    <text x="20" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#16A34A" font-family="system-ui">XLS</text>
                  </svg>
                  <!-- Text icon -->
                  <svg v-else-if="getFileIcon(doc.type) === 'text'" class="h-9 w-9" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="4" fill="#F3E8FF" />
                    <text x="20" y="22" text-anchor="middle" font-size="10" font-weight="bold" fill="#9333EA" font-family="system-ui">TXT</text>
                  </svg>
                  <!-- Image icon -->
                  <svg v-else-if="getFileIcon(doc.type) === 'image'" class="h-9 w-9" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="4" fill="#FEF3C7" />
                    <circle cx="16" cy="15" r="3" fill="#D97706" />
                    <path d="M10 28l6-8 4 5 4-7 6 10H10z" fill="#D97706" opacity="0.6" />
                  </svg>
                  <!-- Generic file icon -->
                  <svg v-else class="h-9 w-9" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="4" fill="#F1F5F9" />
                    <path d="M14 12h7l5 5v11a2 2 0 01-2 2H14a2 2 0 01-2-2V14a2 2 0 012-2z" fill="#94A3B8" opacity="0.5" />
                  </svg>
                </div>
              </button>

              <!-- File info (clickable to open file) -->
              <div class="min-w-0 flex-1">
                <button
                  type="button"
                  class="flex w-full items-center gap-2 text-left"
                  :title="`Open ${doc.name}`"
                  @click="openFile(doc.id)"
                >
                  <p class="truncate text-sm font-medium text-slate-800 transition hover:text-blue-600">{{ doc.name }}</p>
                  <span class="shrink-0 text-xs text-slate-400">{{ formatFileSize(doc.size) }}</span>
                </button>
                <p class="mt-0.5 text-xs text-slate-400">
                  {{ doc.type || 'Unknown type' }}
                  <span v-if="doc.isProcessing" class="ml-2 text-amber-500">Processing...</span>
                  <span v-if="doc.error" class="ml-2 text-rose-500">{{ doc.error }}</span>
                </p>

                <!-- Text preview (expanded) -->
                <div v-if="doc.content && doc.content.length > 0" class="mt-2 max-h-24 overflow-y-auto rounded-md bg-slate-50 p-2.5 font-mono text-[11px] leading-relaxed text-slate-600">
                  <div class="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-1.5">
                    <svg class="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-[10px] font-medium text-slate-500">Preview</span>
                    <span class="text-[10px] text-slate-400">· {{ doc.content.length }} characters</span>
                  </div>
                  <div class="whitespace-pre-wrap break-words">{{ doc.content.substring(0, 500) }}{{ doc.content.length > 500 ? '...' : '' }}</div>
                </div>

                <!-- Parsed questions preview -->
                <div v-if="doc.parsedQuestions.length > 0" class="mt-2.5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <svg class="h-3.5 w-3.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-xs font-semibold text-slate-700">
                        {{ doc.parsedQuestions.length }} question{{ doc.parsedQuestions.length > 1 ? 's' : '' }} detected
                      </span>
                      <span v-if="doc.questionsAdded" class="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">Added ✓</span>
                    </div>
                    <button
                      v-if="!doc.questionsAdded"
                      type="button"
                      class="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-blue-600"
                      @click.stop="addParsedQuestionsToCanvas(doc.id)"
                    >
                      Add to form
                    </button>
                  </div>
                  
                  <!-- Questions list preview -->
                  <div class="mt-1.5 space-y-1">
                    <div
                      v-for="(pq, qi) in doc.parsedQuestions.slice(0, 5)"
                      :key="qi"
                      class="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs"
                    >
                      <!-- Question type badge -->
                      <span
                        class="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                        :class="{
                          'bg-slate-100 text-slate-600': pq.type === 'short_text',
                          'bg-amber-50 text-amber-700': pq.type === 'single_choice',
                          'bg-purple-50 text-purple-700': pq.type === 'multi_choice',
                        }"
                      >
                        {{ pq.type === 'short_text' ? 'Text' : pq.type === 'single_choice' ? 'Single' : 'Multi' }}
                      </span>
                      <span class="truncate text-slate-700">{{ pq.title }}</span>
                      <span v-if="pq.options" class="shrink-0 text-slate-400">
                        ({{ pq.options.length }} opt{{ pq.options.length > 1 ? 's' : '' }})
                      </span>
                    </div>
                    <p v-if="doc.parsedQuestions.length > 5" class="px-2.5 text-[10px] text-slate-400">
                      + {{ doc.parsedQuestions.length - 5 }} more question{{ doc.parsedQuestions.length - 5 > 1 ? 's' : '' }}
                    </p>
                  </div>
                </div>

                <!-- Image preview -->
                <div v-if="doc.previewUrl" class="mt-2">
                  <img
                    :src="doc.previewUrl"
                    :alt="doc.name"
                    class="max-h-32 max-w-full rounded-md border border-slate-200 object-contain"
                  />
                </div>
              </div>

              <!-- Remove file button -->
              <button
                type="button"
                class="shrink-0 rounded-md p-1.5 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                title="Remove file"
                @click="removeFile(doc.id)"
              >
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Drop zone within document section (always visible when docs exist) -->
        <div
          class="flex cursor-pointer items-center justify-center gap-2 border-t border-dashed border-slate-200 px-4 py-2.5 text-center transition-colors"
          :class="isFileDraggingOver ? 'border-blue-400 bg-blue-50' : 'hover:bg-slate-50'"
          @dragover="handleFileDragOver"
          @dragleave="handleFileDragLeave"
          @drop="handleFileDrop"
          @click="triggerFileInput"
        >
          <svg class="h-3.5 w-3.5" :class="isFileDraggingOver ? 'text-blue-500' : 'text-slate-400'" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v12m0 0l-4-4m4 4l4-4M3 17h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text-xs font-medium" :class="isFileDraggingOver ? 'text-blue-600' : 'text-slate-500'">
            Drop more files or click to add
          </span>
        </div>
      </div>

      <!-- Questions list with drag-to-reorder -->
      <template v-if="questions.length > 0">
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
