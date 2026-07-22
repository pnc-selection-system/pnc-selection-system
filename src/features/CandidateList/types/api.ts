export interface CandidateApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: PaginationMeta | null
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
  path: string
  links: { url: string | null; label: string; active: boolean }[]
}

/** Raw candidate data from the backend API (snake_case) */
export interface CandidateApiData {
  id: number
  student_id: string | null
  campaign_id: number | null
  ngo_id: number | null
  province_id: number
  province?: string // Province name (if backend includes it)
  school_name: string | null
  first_name: string
  last_name: string
  first_name_kh: string | null
  last_name_kh: string | null
  gender: 'Male' | 'Female'
  dob: string
  phone: string | null
  status: string
  created_at: string
  updated_at: string
}

/** Payload for creating/updating a candidate (snake_case for backend) */
export interface CandidateApiPayload {
  campaign_id: number | null
  ngo_id: number | null
  province_id: number
  school_name?: string | null
  first_name: string
  last_name: string
  first_name_kh?: string | null
  last_name_kh?: string | null
  gender: 'Male' | 'Female'
  dob: string
  phone?: string | null
  status?: string
}

/** Preview row returned after uploading an import file */
export interface ImportPreviewRow {
  row: number
  first_name: string
  last_name: string
  first_name_kh: string | null
  last_name_kh: string | null
  gender: 'Male' | 'Female' | ''
  dob: string
  phone: string | null
  province_name: string
  school_name: string
  ngo_name: string
  status: string
  valid: boolean
  errors: string[]
}

/** Response from POST /candidates/import/upload */
export interface ImportUploadResponse {
  import_file_id: number
  file_name: string
  total_rows: number
  valid_rows: number
  preview: ImportPreviewRow[]
  errors: string[]
  detected_columns: string[]
  auto_mapping: Record<string, string>
}

/** Response from POST /candidates/import/confirm */
export interface ImportConfirmResponse {
  imported: number
  skipped: number
  errors: string[]
}
