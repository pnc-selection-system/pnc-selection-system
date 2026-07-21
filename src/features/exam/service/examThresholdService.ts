import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export interface ThresholdData {
  pass_score: number
  must_pass_every_subject?: boolean
}

export interface OverallThreshold {
  id: number
  campaign_id: number
  subject_id: null
  pass_score: number
  must_pass_every_subject: boolean
  created_at: string
  updated_at: string
}

export interface SubjectThreshold {
  id: number
  campaign_id: number
  subject_id: number
  pass_score: number
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
  const response = await axios.get(`${API_BASE}/campaigns/${campaignId}/exam-thresholds`, {
    withCredentials: true,
  })
  return response.data.data
}

/**
 * Save or update overall threshold
 */
export async function saveOverallThreshold(campaignId: number, data: ThresholdData): Promise<OverallThreshold> {
  const response = await axios.post(
    `${API_BASE}/campaigns/${campaignId}/exam-thresholds/overall`,
    data,
    { withCredentials: true }
  )
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
  const response = await axios.post(
    `${API_BASE}/campaigns/${campaignId}/exam-thresholds/subjects/${subjectId}`,
    data,
    { withCredentials: true }
  )
  return response.data.data
}

/**
 * Delete threshold
 */
export async function deleteThreshold(id: number): Promise<void> {
  await axios.delete(`${API_BASE}/exam-thresholds/${id}`, {
    withCredentials: true,
  })
}
