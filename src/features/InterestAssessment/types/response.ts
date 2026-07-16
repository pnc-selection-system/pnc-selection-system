export interface QuestionAnswer {
  questionId: string
  value: string | string[] | number
}

export interface CandidateOption {
  id: string
  name: string
}

export interface AssessmentResponse {
  candidateId: string
  answers: QuestionAnswer[]
  score?: number
  passed?: boolean
}