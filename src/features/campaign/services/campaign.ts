import api from '@/plugins/axios'
import type { Campaign, CampaignApiResponse, CampaignPayload } from '../types'

export async function fetchCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get<CampaignApiResponse<Campaign[]>>('/selection-campaigns')
  return data.data
}

export async function createCampaign(payload: CampaignPayload): Promise<Campaign> {
  const { data } = await api.post<CampaignApiResponse<Campaign>>('/selection-campaigns', payload)
  return data.data
}

export async function getCampaign(id: number): Promise<Campaign> {
  const { data } = await api.get<CampaignApiResponse<Campaign>>(`/selection-campaigns/${id}`)
  return data.data
}

export async function updateCampaign(id: number, payload: Partial<CampaignPayload>): Promise<Campaign> {
  const { data } = await api.put<CampaignApiResponse<Campaign>>(`/selection-campaigns/${id}`, payload)
  return data.data
}

export async function deleteCampaign(id: number): Promise<void> {
  await api.delete(`/selection-campaigns/${id}`)
}