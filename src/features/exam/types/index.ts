/** Generic API response wrapper used by the backend */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: null | Record<string, unknown>
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
}

/** Payload for creating/updating an exam subject (snake_case for backend) */
export interface ExamSubjectApiPayload {
  campaign_id: number
  name: string
  max_score: number
  weight?: number | null
}
