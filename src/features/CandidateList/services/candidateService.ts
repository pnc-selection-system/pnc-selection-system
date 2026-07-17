import api from '@/plugins/axios'
import type { CandidateApiData, CandidateApiPayload, CandidateApiResponse, PaginationMeta } from '../types/api'

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
 * Update candidate status (uses PUT /candidates/:id with status field)
 */
export async function updateCandidateStatus(id: number, status: string): Promise<CandidateApiData> {
  return updateCandidate(id, { status })
}
