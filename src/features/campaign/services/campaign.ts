import api from '@/plugins/axios'
import type { Campaign, CampaignApiResponse, CampaignPayload } from '../types'

export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await api.get('/selection-campaigns')
    const result = response.data.data
    return Array.isArray(result) ? result : (result?.data ?? [])
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    throw error
  }
}

export async function createCampaign(payload: CampaignPayload): Promise<Campaign> {
  try {
    const { data } = await api.post<CampaignApiResponse<Campaign>>('/selection-campaigns', payload)
    return data.data
  } catch (error) {
    console.error('Error creating campaign:', error)
    throw error
  }
}

export async function getCampaign(id: number): Promise<Campaign> {
  try {
    const { data } = await api.get<CampaignApiResponse<Campaign>>(`/selection-campaigns/${id}`)
    return data.data
  } catch (error) {
    console.error('Error fetching campaign:', error)
    throw error
  }
}

export async function updateCampaign(id: number, payload: Partial<CampaignPayload>): Promise<Campaign> {
  try {
    const { data } = await api.put<CampaignApiResponse<Campaign>>(`/selection-campaigns/${id}`, payload)
    return data.data
  } catch (error) {
    console.error('Error updating campaign:', error)
    throw error
  }
}

export async function deleteCampaign(id: number): Promise<void> {
  try {
    await api.delete(`/selection-campaigns/${id}`)
  } catch (error) {
    console.error('Error deleting campaign:', error)
    throw error
  }
}
