export interface QuestionAnswer {
  questionId: string
  value: string | string[] | number
}

export interface CandidateOption {
  id: string
  candidateCode: string
  name: string
  province?: string
  organization?: string
  status?: string
}

export interface AssessmentResponse {
  candidateId: string
  answers: QuestionAnswer[]
  score?: number
  passed?: boolean
}

export interface AnswerRow {
  question_id: number
  label: string
  type: string
  answer: string | null
  weight: number
}

export interface CandidateResult {
  candidate_id: number
  candidate_code: string
  candidate_name: string
  province: string | null
  status: string | null
  form_name: string
  answers: AnswerRow[]
  total_score: number
  pass_threshold: number
  passed: boolean
  submitted_at: string
}