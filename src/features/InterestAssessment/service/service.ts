import api from '@/plugins/axios'
import type { AssessmentForm, PageMeta, Question, QuestionType } from '../types/question'
import type { AssessmentResponse, CandidateOption, CandidateResult } from '../types/response'

// ── Type mapping between frontend question types and backend schema types ──
const QUESTION_TYPE_MAP: Record<string, string> = {
  short_text: 'text',
  single_choice: 'select',
  multi_choice: 'checkbox',
  scale_1_5: 'rating',
}

const REVERSE_TYPE_MAP: Record<string, QuestionType> = {
  text: 'short_text',
  select: 'single_choice',
  radio: 'single_choice',
  checkbox: 'multi_choice',
  rating: 'scale_1_5',
}

// ── Helpers ──

function toKey(title: string, index: number): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'question'
  return `${base}_${index}`
}

function parseSchemaFields(schemaFields: any[], formId: string): Question[] {
  return (schemaFields ?? []).map((f: any, i: number) => ({
    id: `${formId}_q_${i}`,
    key: f.key,
    order: i + 1,
    title: f.label ?? f.title ?? '',
    type: REVERSE_TYPE_MAP[f.type] ?? 'short_text',
    weight: f.weight ?? 1,
    options: f.options ?? undefined,
    pointMap: f.point_map ?? f.scoring_config?.option_points ?? undefined,
  }))
}

function makeAssessmentForm(apiForm: any): AssessmentForm {
  const schema = apiForm.schema ?? { fields: [] }
  return {
    id: String(apiForm.id),
    campaignId: apiForm.campaign_id,
    name: apiForm.name,
    campaign: apiForm.campaign ?? '',
    passThreshold: apiForm.pass_threshold ?? 60,
    questions: parseSchemaFields(schema.fields, String(apiForm.id)),
  }
}

// ── Public API ──

export async function fetchFirstCampaign(): Promise<{ id: number; name: string; year: number } | null> {
  try {
    const { data: campaignsData } = await api.get('/selection-campaigns', {
      params: { per_page: 1, status: 'Active' },
    })
    const result = campaignsData.data
    const campaigns = Array.isArray(result) ? result : (result?.data ?? [])
    if (!campaigns.length) return null
    const c = campaigns[0]
    return { id: c.id, name: c.name, year: c.year }
  } catch {
    return null
  }
}

export async function fetchPageMeta(): Promise<PageMeta> {
  return {
    breadcrumb: ['Evaluation', 'Interest Assessment'],
    title: 'Interest assessment',
    roles: [
      { role: 'Manager', action: 'build' },
      { role: 'Officer', action: 'record' },
    ],
    reqRange: ['FR-AS-1', 'FR-AS-6'],
  }
}

export async function fetchActiveForm(): Promise<AssessmentForm | null> {
  try {
    // Step 1: Get form list
    const { data: listData } = await api.get('/assessment-forms')
    const result = listData.data
    const forms = Array.isArray(result) ? result : (result?.data ?? [])
    if (!forms || forms.length === 0) return null

    // Step 2: Fetch full form details (includes schema with fields)
    const { data: formData } = await api.get<{ data: any }>(`/assessment-forms/${forms[0].id}`)
    return makeAssessmentForm(formData.data)
  } catch {
    return null
  }
}

export async function saveForm(form: AssessmentForm): Promise<AssessmentForm> {
  // Map frontend question types to backend schema types
  const fields = form.questions.map((q, i) => {
    const rules: Record<string, any> = { required: true }
    // For rating/scale questions, set min=1 max=5 so scoring normalizes correctly
    if (QUESTION_TYPE_MAP[q.type] === 'rating') {
      rules.min = 1
      rules.max = 5
    }
    return {
      key: q.key || toKey(q.title, i),
      label: q.title,
      type: QUESTION_TYPE_MAP[q.type] ?? 'text',
      weight: q.weight,
      options: q.options,
      point_map: q.pointMap,
      rules,
    }
  })

  const payload = {
    campaign_id: form.campaignId ?? 1,
    name: form.name,
    pass_threshold: form.passThreshold,
    schema: { fields },
  }

  const isNew = !form.id || form.id === ''
  if (isNew) {
    const { data } = await api.post<{ data: any }>('/assessment-forms', payload)
    return makeAssessmentForm(data.data)
  } else {
    const { data } = await api.put<{ data: any }>(`/assessment-forms/${form.id}`, payload)
    return makeAssessmentForm(data.data)
  }
}

export async function cloneFormFromYear(_year: string): Promise<Question[]> {
  return []
}

export async function fetchCandidatesPendingResponse(): Promise<CandidateOption[]> {
  try {
    const { data } = await api.get<{ data: any[] }>('/candidates')
    return (data.data ?? []).map((c: any) => ({
      id: String(c.id),
      candidateCode: c.code ?? `C-${String(c.id).padStart(4, '0')}`,
      name: c.full_name ?? `${c.first_name} ${c.last_name}`,
      province: c.province?.name ?? c.province ?? '',
      organization: c.ngo?.name ?? '',
      status: c.status ?? '',
    }))
  } catch {
    return []
  }
}

export async function fetchAllResponses(formId?: string, search?: string): Promise<CandidateResult[]> {
  try {
    if (!formId) return []
    const { data } = await api.get<{ data: { data: any[] } }>(`/assessment-forms/${formId}/responses`, {
      params: { search, per_page: 100 },
    })
    return (data.data?.data ?? []).map((r: any) => ({
      candidate_id: r.candidate_id,
      candidate_code: r.candidate_code,
      candidate_name: r.candidate_name,
      province: r.province,
      status: r.status,
      form_name: r.form_name,
      answers: (r.answers ?? []).map((a: any) => ({
        question_id: a.question_id,
        label: a.label,
        type: a.type,
        answer: a.answer,
        weight: a.weight,
      })),
      total_score: r.total_score,
      pass_threshold: r.pass_threshold,
      passed: r.passed,
      submitted_at: r.submitted_at,
    }))
  } catch {
    return []
  }
}

export async function submitResponse(formId: string, response: AssessmentResponse, keyMap: Record<string, string> = {}): Promise<AssessmentResponse & { passThreshold?: number; submittedAt?: string }> {
  // Build answers as { key: value } pairs for the backend's scoreResponse method
  // keyMap maps frontend question IDs → schema field keys
  const answers: Record<string, string> = {}
  response.answers.forEach((a) => {
    const key = keyMap[a.questionId] ?? a.questionId
    answers[key] = Array.isArray(a.value) ? a.value.join(',') : String(a.value)
  })

  const payload = {
    candidate_id: Number(response.candidateId),
    answers,
  }

  const { data } = await api.post<{ data: any }>(`/assessment-forms/${formId}/responses`, payload)
  const result = data.data
  return {
    ...response,
    score: result?.total_score ?? 0,
    passed: result?.passed ?? false,
    passThreshold: result?.pass_threshold,
    submittedAt: result?.submitted_at,
  }
}
