import { CampaignStatus } from '@/enums'

export type { CampaignStatus }

export interface Province {
  id: number
  name: string
}

export interface Campaign {
  id: number
  name: string
  year: number
  condidate_total: number
  start_date: string
  end_date: string
  status: CampaignStatus
  province_ids?: number[]
  provinces?: Province[]
  province_total?: number
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
  province_ids?: number[]
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

