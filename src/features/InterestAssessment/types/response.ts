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