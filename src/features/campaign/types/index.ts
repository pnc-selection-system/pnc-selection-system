import { CampaignStatus } from '@/enums'

export type { CampaignStatus }

export interface Campaign {
  id: number
  name: string
  year: number
  condidate_total: number
  start_date: string
  end_date: string
  status: CampaignStatus
  created_at?: string
  updated_at?: string
}

export interface CampaignPayload {
  name: string
  year: number
  condidate_total: number
  start_date: string
  end_date: string
  status?: CampaignStatus
}

export interface CampaignApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: null | Record<string, unknown>
}

export const statusLabels: Record<CampaignStatus, string> = {
  [CampaignStatus.Active]: 'Active',
  [CampaignStatus.Closed]: 'Closed',
}

export const statusBadges: Record<CampaignStatus, { bg: string; text: string; dot: string }> = {
  [CampaignStatus.Active]: { bg: '#EFF6FF', text: '#2563EB', dot: '#2563EB' },
  [CampaignStatus.Closed]: { bg: '#ECFDF5', text: '#059669', dot: '#059669' },
}
