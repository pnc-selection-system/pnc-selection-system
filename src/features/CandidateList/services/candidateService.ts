import api from '@/plugins/axios'
import type { CandidateApiData, CandidateApiPayload, CandidateApiResponse, ImportConfirmResponse, ImportUploadResponse, PaginationMeta } from '../types/api'

export interface FetchCandidatesParams {
  page?: number
  per_page?: number
  search?: string
  province_id?: number
  ngo_id?: number
  status?: string
  exam_result?: string
}

export interface FetchCandidatesResult {
  candidates: CandidateApiData[]
  meta: PaginationMeta | null
}

/**
 * Fetch paginated list of candidates
 */
export async function fetchCandidates(params: FetchCandidatesParams = {}): Promise<FetchCandidatesResult> {
  const { data } = await api.get<CandidateApiResponse<CandidateApiData[]>>('/candidates', { params })
  return {
    candidates: data.data,
    meta: data.meta,
  }
}

/**
 * Fetch a single candidate by ID
 */
export async function getCandidate(id: number): Promise<CandidateApiData> {
  const { data } = await api.get<CandidateApiResponse<CandidateApiData>>(`/candidates/${id}`)
  return data.data
}

/**
 * Create a new candidate
 */
export async function createCandidate(payload: CandidateApiPayload): Promise<CandidateApiData> {
  const { data } = await api.post<CandidateApiResponse<CandidateApiData>>('/candidates', payload)
  return data.data
}

/**
 * Update an existing candidate
 */
export async function updateCandidate(id: number, payload: Partial<CandidateApiPayload>): Promise<CandidateApiData> {
  const { data } = await api.put<CandidateApiResponse<CandidateApiData>>(`/candidates/${id}`, payload)
  return data.data
}

/**
 * Delete a candidate
 */
export async function deleteCandidate(id: number): Promise<void> {
  await api.delete(`/candidates/${id}`)
}

/**
 * Check if a candidate with the given phone already exists.
 * Returns matching candidates so the caller can verify full name match.
 */
export async function checkDuplicateCandidate(phone: string): Promise<CandidateApiData[]> {
  const { data } = await api.get<CandidateApiResponse<CandidateApiData[]>>('/candidates', {
    params: { search: phone, per_page: 50 },
  })
  return data.data
}

/**
 * Update candidate status (uses PUT /candidates/:id with status field)
 */
export async function updateCandidateStatus(id: number, status: string): Promise<CandidateApiData> {
  return updateCandidate(id, { status })
}

/**
 * Upload an Excel/CSV file for candidate import
 * Returns parsed preview data
 */
export async function uploadImportFile(file: File, extra?: {
  campaign_id?: number
  province_id?: number
  ngo_id?: number
}): Promise<ImportUploadResponse> {
  const formData = new FormData()
  // Append with filename — some backends require the third parameter
  formData.append('file', file, file.name)

  if (extra?.campaign_id) {
    formData.append('campaign_id', String(extra.campaign_id))
  }
  if (extra?.province_id) {
    formData.append('province_id', String(extra.province_id))
  }
  if (extra?.ngo_id) {
    formData.append('ngo_id', String(extra.ngo_id))
  }

  // Let axios auto-set multipart/form-data with boundary (don't set Content-Type manually)
  const response = await api.post('/candidates/import/upload', formData)

  const body = response.data
  console.log('[Import API Response]', body)

  // Handle both Laravel wrapper { success, data: {...} } and direct response { ... }
  const result = body?.data ?? body

  if (!result || typeof result.total_rows !== 'number') {
    const errMsg = typeof result === 'object' && result !== null
      ? JSON.stringify(result)
      : String(result)
    throw new Error(`Server returned an unexpected response format: ${errMsg}`)
  }

  return result as ImportUploadResponse
}

/**
 * Confirm and commit the imported candidates
 */
export async function confirmImport(importFileId: number, columnMapping: Record<number, string>): Promise<ImportConfirmResponse> {
  const { data } = await api.post<CandidateApiResponse<ImportConfirmResponse>>(
    '/candidates/import/confirm',
    {
      import_file_id: importFileId,
      column_mapping: columnMapping,
    },
  )
  return data.data
}

























































