<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '../Components/PageHeader.vue'
import AssessmentTabs from '../Components/AssessmentTabs.vue'
import QuestionPalette from '../Components/QuestionPalette.vue'
import FormCanvas from '../Components/FormCanvas.vue'
import RecordResponseForm from '../Components/RecordResponseForm.vue'
import ResponseResultsTable from '../Components/ResponseResultsTable.vue'
import { useAssessmentFormStore } from '../store/useAssessmentFormStore'
import { cloneFormFromYear, fetchAllResponses, fetchCandidatesPendingResponse, fetchPageMeta, submitResponse } from '../service/service'
import type { PageMeta, Question, QuestionType } from '../types/question'
import type { AssessmentResponse, CandidateOption, CandidateResult } from '../types/response'

type AssessmentTab = 'builder' | 'record' | 'results'

const store = useAssessmentFormStore()

const meta = ref<PageMeta>({
  breadcrumb: [],
  title: 'Interest Assessment',
  roles: [],
  reqRange: ['', ''],
})
const activeTab = ref<AssessmentTab>('builder')
const candidates = ref<CandidateOption[]>([])
const results = ref<CandidateResult[]>([])

// Local builder draft - only committed to the store on "Save form"
const draftQuestions = ref<Question[]>([])
const draftThreshold = ref(60)

// Track selected options and scales separately for better reactivity
const selectedOptions = ref<Record<string, string>>({})
const selectedScales = ref<Record<string, number>>({})

const isSaving = ref(false)
const isSubmitting = ref(false)
const formName = computed(() => store.activeForm?.name ?? '')

function addQuestion(type: QuestionType) {
  const defaultTitles: Record<QuestionType, string> = {
    short_text: 'New short text question',
    single_choice: 'New single choice question',
    multi_choice: 'New multi choice question',
    scale_1_5: 'New scale question',
  }
  draftQuestions.value = [
    ...draftQuestions.value,
    {
      id: `q${Date.now()}`,
      order: draftQuestions.value.length + 1,
      title: defaultTitles[type],
      type,
      weight: 1,
      options: type === 'single_choice' || type === 'multi_choice' ? ['Option A', 'Option B'] : undefined,
    },
  ]
}

async function handleCloneFromYear(year: string) {
  draftQuestions.value = await cloneFormFromYear(year)
}

function handleScaleSelect(questionId: string, value: number) {
  selectedScales.value[questionId] = value
}

function handleOptionSelect(questionId: string, option: string) {
  const question = draftQuestions.value.find(q => q.id === questionId)
  if (!question) return
  
  if (question.type === 'multi_choice') {
    const current = selectedOptions.value[questionId]?.split(',') || []
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option]
    selectedOptions.value[questionId] = updated.join(',')
  } else {
    selectedOptions.value[questionId] = option
  }
}

async function handleSave() {
  if (!store.activeForm) return
  isSaving.value = true
  try {
    const saved = await store.save({
      ...store.activeForm,
      questions: draftQuestions.value,
      passThreshold: draftThreshold.value,
    })
    // Reload form from saved data so it shows the new saved state
    draftQuestions.value = saved.questions
    ElMessage.success('Form saved successfully!')
  } finally {
    isSaving.value = false
  }
}

async function handleSubmitResponse(response: AssessmentResponse) {
  isSubmitting.value = true
  try {
    await submitResponse(response)
    ElMessage.success('Response recorded successfully!')
    results.value = await fetchAllResponses()
    activeTab.value = 'results'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  // Load saved data from localStorage
  try {
    const savedOptions = localStorage.getItem('pnc_selected_options')
    if (savedOptions) selectedOptions.value = JSON.parse(savedOptions)
  } catch (e) {
    console.error('Failed to load selected options:', e)
  }
  
  try {
    const savedScales = localStorage.getItem('pnc_selected_scales')
    if (savedScales) selectedScales.value = JSON.parse(savedScales)
  } catch (e) {
    console.error('Failed to load selected scales:', e)
  }
  
  try {
    const [metaData, , candidatesData, resultsData] = await Promise.all([
      fetchPageMeta(),
      store.load(),
      fetchCandidatesPendingResponse(),
      fetchAllResponses(),
    ])
    meta.value = metaData
    candidates.value = candidatesData
    results.value = resultsData

    if (store.activeForm) {
      draftQuestions.value = store.activeForm.questions
      draftThreshold.value = store.activeForm.passThreshold
    }
  } catch (error) {
    console.error('InterestAssessment: Failed to load:', error)
  }
})
</script>

<template>
  <div class="min-h-screen p-6" style="pointer-events: auto;">
    <div class="mx-auto max-w-[1200px] space-y-4" style="pointer-events: auto;">
      <PageHeader :meta="meta" />

      <AssessmentTabs v-model="activeTab" />

      <template v-if="activeTab === 'builder'">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
          <QuestionPalette @add-question="addQuestion" @clone-from-year="handleCloneFromYear" />
          <FormCanvas
            :form-name="formName"
            :questions="draftQuestions"
            :pass-threshold="draftThreshold"
            :selected-options="selectedOptions"
            :selected-scales="selectedScales"
            :saving="isSaving"
            @update:questions="draftQuestions = $event"
            @update:pass-threshold="draftThreshold = $event"
            @save="handleSave"
            @select-scale="handleScaleSelect"
            @select-option="handleOptionSelect"
            @add-question="addQuestion"
          />
        </div>
      </template>

      <RecordResponseForm
        v-if="activeTab === 'record' && store.activeForm"
        :form="store.activeForm"
        :candidates="candidates"
        :submitting="isSubmitting"
        @submit="handleSubmitResponse"
      />

      <ResponseResultsTable
        v-if="activeTab === 'results'"
        :results="results"
      />
    </div>
  </div>
</template>