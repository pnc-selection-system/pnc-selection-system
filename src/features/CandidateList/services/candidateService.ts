import api from '@/plugins/axios'
export const getCandidates = (params?: Record<string, unknown>) =>
  api.get('/candidates', { params })
