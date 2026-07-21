import api from '@/plugins/axios'

export interface ThresholdData {
  overall_pass_mark: number
  per_subject_min: number
  must_pass_every_subject?: boolean
}

export interface OverallThreshold {
  id: number
  campaign_id: number
  subject_id: null
  overall_pass_mark: number
  per_subject_min: number
  must_pass_every_subject: boolean
  created_at: string
  updated_at: string
}

export interface SubjectThreshold {
  id: number
  campaign_id: number
  subject_id: number
  overall_pass_mark: number | null
  per_subject_min: number | null
  must_pass_every_subject: boolean | null
  subject?: {
    id: number
    name: string
    max_score: number
    weight: number
  }
  created_at: string
  updated_at: string
}

export interface CampaignThresholds {
  overall: OverallThreshold | null
  subjects: SubjectThreshold[]
}

/**
 * Get thresholds for a campaign
 */
export async function fetchCampaignThresholds(campaignId: number): Promise<CampaignThresholds> {
  const response = await api.get(`/campaigns/${campaignId}/exam-thresholds`)
  return response.data.data
}

/**
 * Save or update overall threshold
 */
export async function saveOverallThreshold(campaignId: number, data: ThresholdData): Promise<OverallThreshold> {
  const response = await api.post(`/campaigns/${campaignId}/exam-thresholds/overall`, data)
  return response.data.data
}

/**
 * Save or update subject threshold
 */
export async function saveSubjectThreshold(
  campaignId: number,
  subjectId: number,
  data: ThresholdData
): Promise<SubjectThreshold> {
  const response = await api.post(`/campaigns/${campaignId}/exam-thresholds/subjects/${subjectId}`, data)
  return response.data.data
}

/**
 * Delete threshold
 */
export async function deleteThreshold(id: number): Promise<void> {
  await api.delete(`/exam-thresholds/${id}`)
}
