import api from '@/plugins/axios'
import type { ApiResponse, ExamSubjectApiData, ExamSubjectApiPayload } from '../types'

/**
 * Fetch exam subjects, optionally filtered by campaign_id
 */
export async function fetchSubjects(campaignId?: number): Promise<ExamSubjectApiData[]> {
  const params: Record<string, string | number> = {}
  if (campaignId) {
    params.campaign_id = campaignId
  }
  const { data } = await api.get<ApiResponse<ExamSubjectApiData[]>>('/exam-subjects', { params })
  return data.data ?? []
}

/**
 * Fetch a single exam subject by ID
 */
export async function getSubject(id: number): Promise<ExamSubjectApiData> {
  const { data } = await api.get<ApiResponse<ExamSubjectApiData>>(`/exam-subjects/${id}`)
  return data.data
}

/**
 * Create a new exam subject
 */
export async function createSubject(payload: ExamSubjectApiPayload): Promise<ExamSubjectApiData> {
  const { data } = await api.post<ApiResponse<ExamSubjectApiData>>('/exam-subjects', payload)
  return data.data
}

/**
 * Update an existing exam subject
 */
export async function updateSubject(id: number, payload: Partial<ExamSubjectApiPayload>): Promise<ExamSubjectApiData> {
  const { data } = await api.put<ApiResponse<ExamSubjectApiData>>(`/exam-subjects/${id}`, payload)
  return data.data
}

/**
 * Delete an exam subject (soft-delete)
 */
export async function deleteSubject(id: number): Promise<void> {
  await api.delete(`/exam-subjects/${id}`)
}
