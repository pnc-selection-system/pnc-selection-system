import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Question, QuestionType } from '../types/question'

export interface UploadedDoc {
  id: string
  name: string
  type: string
  size: number
  content: string | null
  previewUrl: string | null
  fileRef: File | null
  isProcessing: boolean
  error: string | null
  parsedQuestions: Question[]
  questionsAdded: boolean
}

// ── Helpers ──

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

// ── Question parsing from text ──

function isQuestionLine(line: string): boolean {
  const t = line.trim()
  if (!t) return false
  if (t.endsWith('?')) return true
  if (/^\s*(?:Q(?:uestion)?\s*)?\d+[.)]/.test(t)) return true
  if (t.endsWith(':') && t.length > 5) return true
  if (/\b(?:what|why|how|when|where|which|who|describe|explain|list|select|choose|rate|rank)\b/i.test(t) && /[?:]$/.test(t)) return true
  return false
}

function isSingleChoiceOption(line: string): boolean {
  const t = line.trim()
  return /^[○\u25CB]\s/.test(t) || /^\(\s?\)\s/.test(t) || /^\([a-z]\)\s/.test(t)
    || /^[a-z][.)]\s/.test(t) || /^-\s/.test(t) || /^•\s/.test(t) || /^\*\s/.test(t)
}

function isMultiChoiceOption(line: string): boolean {
  const t = line.trim()
  return /^[☐□\u2610\u2611]\s/.test(t) || /^\[\s?\]\s/.test(t) || /^\[x\]\s/i.test(t) || /^\[X\]\s/.test(t)
}

function cleanOptionText(line: string): string {
  return line.trim()
    .replace(/^[○\u25CB)\s]/, '').replace(/^\(\s?\)\s*/, '').replace(/^\([a-z]\)\s*/i, '')
    .replace(/^[a-z][.)]\s*/i, '').replace(/^[☐□\u2610\u2611]\s*/, '').replace(/^\[\s?\]\s*\s*/, '')
    .replace(/^\[x\]\s*/i, '').replace(/^[-•*]\s*/, '').replace(/^\d+[.)]\s*/, '').trim()
}

function cleanQuestionTitle(line: string): string {
  return line.trim().replace(/^Q(?:uestion)?\s*\d+[.)]\s*/i, '').replace(/^\d+[.)]\s*/, '').replace(/[:?]+$/, '').trim()
}

function parseQuestionsFromText(text: string): Question[] {
  const lines = text.split('\n')
  const questions: Question[] = []
  let currentQuestion: Partial<Question> | null = null
  let currentOptions: string[] = []
  let optionType: 'single' | 'multi' | null = null

  function flush() {
    if (!currentQuestion) return
    currentQuestion.type = currentOptions.length > 0 ? (optionType === 'multi' ? 'multi_choice' : 'single_choice') : 'short_text'
    if (currentOptions.length > 0) currentQuestion.options = [...currentOptions]
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

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (isQuestionLine(line)) {
      if (currentQuestion) flush()
      currentQuestion = { title: cleanQuestionTitle(line) }
      currentOptions = []
      optionType = null
    } else if (isMultiChoiceOption(line)) {
      if (!currentQuestion) currentQuestion = { title: 'Question' }
      optionType = 'multi'
      currentOptions.push(cleanOptionText(line))
    } else if (isSingleChoiceOption(line)) {
      if (!currentQuestion) currentQuestion = { title: 'Question' }
      if (optionType !== 'multi') optionType = 'single'
      currentOptions.push(cleanOptionText(line))
    } else if (line && currentQuestion && currentOptions.length > 0) {
      if (line.length < 60 && !line.endsWith('.') && !line.endsWith(':') && !/^\d+[.)]/.test(line)) {
        currentOptions.push(line)
      }
    }
  }
  if (currentQuestion) flush()
  return questions
}

// ── Composable ──

export function useDocumentUpload() {
  const uploadedDocs = ref<UploadedDoc[]>([])
  const isFileDraggingOver = ref(false)
  const showFileSection = ref(true)
  const fileInputRef = ref<HTMLInputElement | null>(null)

  const totalFileSize = computed(() => {
    const total = uploadedDocs.value.reduce((s, d) => s + d.size, 0)
    return formatFileSize(total)
  })

  const hasUnaddedQuestions = computed(() =>
    uploadedDocs.value.some(d => d.parsedQuestions.length > 0 && !d.questionsAdded),
  )

  onUnmounted(() => {
    uploadedDocs.value.forEach(d => { if (d.previewUrl) URL.revokeObjectURL(d.previewUrl) })
  })

  // ── File drag handling ──

  function handleFileDragOver(e: DragEvent) {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    isFileDraggingOver.value = true
  }

  function handleFileDragLeave() { isFileDraggingOver.value = false }

  function handleFileDrop(e: DragEvent) {
    e.preventDefault()
    isFileDraggingOver.value = false
    const files = e.dataTransfer?.files
    if (files && files.length > 0) processFiles(files)
  }

  function handleFileInputChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files && files.length > 0) processFiles(files)
    if (target.value) target.value = ''
  }

  function triggerFileInput() { fileInputRef.value?.click() }

  async function processFiles(fileList: FileList) {
    const newDocs: UploadedDoc[] = []
    for (const file of Array.from(fileList)) {
      const doc: UploadedDoc = {
        id: generateFileId(), name: file.name, type: file.type, size: file.size,
        content: null, previewUrl: null, fileRef: file,
        isProcessing: true, error: null, parsedQuestions: [], questionsAdded: false,
      }
      newDocs.push(doc)
      try {
        const isText = file.type.includes('text') || file.type.includes('txt')
        if (isText) {
          doc.content = await file.text()
          if (doc.content?.trim()) doc.parsedQuestions = parseQuestionsFromText(doc.content)
        }
        if (file.type.includes('image')) doc.previewUrl = URL.createObjectURL(file)
        doc.isProcessing = false
      } catch {
        doc.isProcessing = false
        doc.error = 'Failed to read file'
      }
    }
    uploadedDocs.value = [...uploadedDocs.value, ...newDocs]
    showFileSection.value = true
    const totalParsed = newDocs.reduce((s, d) => s + d.parsedQuestions.length, 0)
    const names = newDocs.map(d => d.name).join(', ')
    if (totalParsed > 0) ElMessage.success(`Parsed ${totalParsed} question(s) from ${newDocs.length} file(s)`)
    else ElMessage.success(`Uploaded ${newDocs.length} file(s): ${names}`)
  }

  // ── Document actions ──

  function openFile(docId: string) {
    const doc = uploadedDocs.value.find(d => d.id === docId)
    if (!doc?.fileRef) return
    const url = URL.createObjectURL(doc.fileRef)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  function removeFile(docId: string) {
    const doc = uploadedDocs.value.find(d => d.id === docId)
    if (doc?.previewUrl) URL.revokeObjectURL(doc.previewUrl)
    uploadedDocs.value = uploadedDocs.value.filter(d => d.id !== docId)
    if (uploadedDocs.value.length === 0) showFileSection.value = true
  }

  function clearAllFiles() {
    uploadedDocs.value.forEach(d => { if (d.previewUrl) URL.revokeObjectURL(d.previewUrl) })
    uploadedDocs.value = []
    ElMessage.info('All files removed')
  }

  function addParsedQuestionsToCanvas(docId: string, existingCount: number, emit: (q: Question[]) => void) {
    const doc = uploadedDocs.value.find(d => d.id === docId)
    if (!doc || doc.parsedQuestions.length === 0 || doc.questionsAdded) return
    const newQ = doc.parsedQuestions.map((q, i) => ({
      ...q, id: `q_from_doc_${docId}_${i}`, order: existingCount + i + 1,
    }))
    emit(newQ)
    doc.questionsAdded = true
    ElMessage.success(`Added ${newQ.length} question(s) from "${doc.name}" to the form`)
  }

  function addAllParsedQuestions(existingCount: number, emit: (q: Question[]) => void) {
    let allNew: Question[] = [], docCount = 0
    for (const doc of uploadedDocs.value) {
      if (doc.parsedQuestions.length > 0 && !doc.questionsAdded) {
        const base = existingCount + allNew.length
        allNew = [...allNew, ...doc.parsedQuestions.map((q, i) => ({
          ...q, id: `q_from_doc_${doc.id}_${i}`, order: base + i + 1,
        }))]
        doc.questionsAdded = true
        docCount++
      }
    }
    if (allNew.length > 0) { emit(allNew); ElMessage.success(`Added ${allNew.length} question(s) from ${docCount} document(s)`) }
  }

  return {
    uploadedDocs, isFileDraggingOver, showFileSection, fileInputRef,
    totalFileSize, hasUnaddedQuestions,
    handleFileDragOver, handleFileDragLeave, handleFileDrop, handleFileInputChange, triggerFileInput,
    openFile, removeFile, clearAllFiles, processFiles,
    addParsedQuestionsToCanvas, addAllParsedQuestions,
    formatFileSize,
  }
}
