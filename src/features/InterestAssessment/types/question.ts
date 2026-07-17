export type QuestionType = 'short_text' | 'single_choice' | 'multi_choice' | 'scale_1_5'

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: 'Short text',
  single_choice: 'Single choice',
  multi_choice: 'Multi choice',
  scale_1_5: 'Scale 1–5',
}

export interface Question {
  id: string
  order: number
  title: string
  type: QuestionType
  weight: number
  options?: string[] // for single_choice / multi_choice
}

export interface AssessmentForm {
  id: string
  name: string
  campaign: string
  questions: Question[]
  passThreshold: number // percentage, e.g. 60
}

export interface RoleAction {
  role: string
  action: string
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: RoleAction[]
  reqRange: [string, string]
}