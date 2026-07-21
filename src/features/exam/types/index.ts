/** Generic API response wrapper used by the backend */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: null | Record<string, unknown>
}

/** Raw rule data from the backend (snake_case) */
export interface RuleApiData {
  id: number
  exam_subject_id: number
  name: string
  desc: string | null
  sign: '+' | '-' | '*' | '%'
  value: number
  status: 'active' | 'inactive'
  is_delete: boolean
  created_at: string
}

/** Payload for creating/updating a rule (snake_case for backend) */
export interface RuleApiPayload {
  id?: number
  name: string
  desc?: string | null
  sign: '+' | '-' | '*' | '%'
  value: number
  status?: 'active' | 'inactive'
}

/** Raw exam subject data from the backend (snake_case) */
export interface ExamSubjectApiData {
  id: number
  campaign_id: number
  name: string
  max_score: number
  weight: number
  is_delete: boolean
  created_at: string
  campaign?: {
    id: number
    name: string
    status: string
  }
  rules?: RuleApiData[]
}

/** Payload for creating/updating an exam subject (snake_case for backend) */
export interface ExamSubjectApiPayload {
  campaign_id: number
  name: string
  max_score: number
  weight?: number | null
  rules?: RuleApiPayload[]
}
