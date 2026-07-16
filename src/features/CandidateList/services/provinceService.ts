import api from '@/plugins/axios'
import type { CandidateApiResponse } from '../types/api'

export interface ProvinceData {
  id: number
  name: string
}

/**
 * Fetch all provinces from the backend
 */
export async function fetchProvinces(): Promise<ProvinceData[]> {
  const { data } = await api.get<CandidateApiResponse<ProvinceData[]>>('/provinces')
  return data.data
}
