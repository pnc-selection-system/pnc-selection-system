import type { AssessmentForm, PageMeta, Question } from '../types/question'
import type { AssessmentResponse, CandidateOption } from '../types/response'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const LOCAL_STORAGE_KEY = 'pnc_active_form'

const INITIAL_FORM: AssessmentForm = {
  id: 'f1',
  name: 'Motivation 2026',
  campaign: '2026',
  passThreshold: 60,
  questions: [
    { id: 'q1', order: 1, title: 'Why this programme?', type: 'short_text', weight: 2 },
    { id: 'q2', order: 2, title: 'Commitment level', type: 'scale_1_5', weight: 3 },
  ],
}

let activeForm: AssessmentForm = (() => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load activeForm from localStorage', e)
  }
  return INITIAL_FORM
})()

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Evaluation', 'Interest Assessment'],
    title: 'Interest assessment',
    roles: [
      { role: 'Manager', action: 'build' },
      { role: 'Officer', action: 'record' },
    ],
    reqRange: ['FR-AS-1', 'FR-AS-6'],
  })
}

export async function fetchActiveForm(): Promise<AssessmentForm> {
  return wait(JSON.parse(JSON.stringify(activeForm)))
}

export async function saveForm(form: AssessmentForm): Promise<AssessmentForm> {
  activeForm = JSON.parse(JSON.stringify(form))
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeForm))
  } catch (e) {
    console.error('Failed to save activeForm to localStorage', e)
  }
  return wait(JSON.parse(JSON.stringify(activeForm)))
}

export async function cloneFormFromYear(year: string): Promise<Question[]> {
  // Pretend last year's form had an extra screening question.
  return wait([
    { id: 'q1', order: 1, title: 'Why this programme?', type: 'short_text', weight: 2 },
    { id: 'q2', order: 2, title: 'Commitment level', type: 'scale_1_5', weight: 3 },
    { id: 'q3', order: 3, title: 'Available on weekends?', type: 'single_choice', weight: 1, options: ['Yes', 'No'] },
  ])
}

export async function fetchCandidatesPendingResponse(): Promise<CandidateOption[]> {
  return wait([
    { id: 'c1', name: 'Pisey L.' },
    { id: 'c2', name: 'Rithy S.' },
    { id: 'c3', name: 'Sokha N.' },
  ])
}

export async function submitResponse(response: AssessmentResponse): Promise<AssessmentResponse> {
  return wait({ ...response, score: 78, passed: true })
}