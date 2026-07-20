import api from '@/plugins/axios'
import type { AssessmentForm, PageMeta, Question } from '../types/question'
import type { AssessmentResponse, CandidateOption, CandidateResult } from '../types/response'

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

export async function fetchActiveForm(): Promise<AssessmentForm> {
  const { data: listData } = await api.get<{ data: any[] }>('/assessment-forms')
  const forms = listData.data
  if (!forms || forms.length === 0) throw new Error('No assessment form found')
  const form = forms[0]

  const { data: qData } = await api.get<{ data: any[] }>(`/assessment-forms/${form.id}/questions`)
  const questions = (qData.data ?? []).map((q: any) => ({
    id: String(q.id),
    key: q.key,
    order: q.order ?? 0,
    title: q.label,
    type: q.type,
    weight: q.weight ?? 1,
    options: q.options ?? undefined,
    pointMap: q.point_map ?? undefined,
  }))

  return {
    id: String(form.id),
    campaignId: form.campaign_id,
    name: form.name,
    campaign: form.campaign ?? '',
    passThreshold: form.pass_threshold ?? 60,
    questions,
  }
}

function toKey(title: string, index: number): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || `question_${index}`
  return base
}

export async function saveForm(form: AssessmentForm): Promise<AssessmentForm> {
  const fields = form.questions.map((q, i) => ({
    key: q.key || toKey(q.title, i),
    label: q.title,
    type: q.type,
    weight: q.weight,
    options: q.options,
    point_map: q.pointMap,
    rules: { required: true },
  }))

  const payload = {
    campaign_id: form.campaignId ?? 1,
    name: form.name,
    pass_threshold: form.passThreshold,
    schema: { fields },
  }

  const isNew = !form.id || form.id === ''
  if (isNew) {
    const { data } = await api.post<{ data: any }>('/assessment-forms', payload)
    return { ...form, id: String(data.data.id) }
  } else {
    await api.put(`/assessment-forms/${form.id}`, payload)
    return form
  }
}

export async function cloneFormFromYear(_year: string): Promise<Question[]> {
  return []
}

export async function fetchCandidatesPendingResponse(): Promise<CandidateOption[]> {
  const { data } = await api.get<{ data: any[] }>('/candidates')
  return (data.data ?? []).map((c: any) => ({
    id: String(c.id),
    candidateCode: c.code ?? `C-${String(c.id).padStart(4, '0')}`,
    name: c.full_name ?? `${c.first_name} ${c.last_name}`,
    province: c.province?.name ?? c.province ?? '',
    organization: c.ngo?.name ?? '',
    status: c.status ?? '',
  }))
}

export async function fetchAllResponses(): Promise<CandidateResult[]> {
  const { data } = await api.get<{ data: CandidateResult[] }>('/assessment-responses')
  return data.data ?? []
}

export async function submitResponse(response: AssessmentResponse): Promise<AssessmentResponse> {
  const payload = {
    candidate_id: Number(response.candidateId),
    answers: response.answers.map((a) => ({
      question_id: Number(a.questionId),
      answer: Array.isArray(a.value) ? a.value.join(',') : String(a.value),
    })),
  }
  const { data } = await api.post<{ data: any }>('/assessment-responses/submit', payload)
  return {
    ...response,
    score: data.data?.total_score,
    passed: data.data?.passed,
  }
}

export function exportAssessmentResults(results: CandidateResult[]): void {
  // Build dynamic headers from answer labels
  const answerLabels = new Set<string>()
  results.forEach((r) => r.answers.forEach((a) => answerLabels.add(a.label)))
  const sortedLabels = Array.from(answerLabels)

  const headers = [
    'Candidate Code',
    'Candidate Name',
    'Province',
    'Status',
    'Form',
    ...sortedLabels,
    'Total Score',
    'Threshold',
    'Result',
    'Submitted At',
  ]

  const csvRows = [headers.join(',')]

  results.forEach((row) => {
    // Build answer map for easy lookup
    const answerMap: Record<string, string> = {}
    row.answers.forEach((a) => {
      answerMap[a.label] = a.answer ?? ''
    })

    const values = [
      `"${row.candidate_code}"`,
      `"${row.candidate_name}"`,
      `"${row.province ?? ''}"`,
      `"${row.status ?? ''}"`,
      `"${row.form_name}"`,
      ...sortedLabels.map((label) => `"${(answerMap[label] ?? '').replace(/"/g, '""')}"`),
      row.total_score,
      row.pass_threshold,
      row.passed ? 'Passed' : 'Failed',
      `"${row.submitted_at}"`,
    ]
    csvRows.push(values.join(','))
  })

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `assessment-results-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}