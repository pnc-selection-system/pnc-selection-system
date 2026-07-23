import api from '@/plugins/axios'
import type { Candidate, InvestigationFormData, HStatus, AttachmentFile, CandidateFilters, PageMeta } from '../types/visit'

// ── In-memory cache for static dropdown data ───────────────────────────
let cachedCampaigns: string[] | null = null
let cachedInvestigators: string[] | null = null
let cachedStatuses: string[] | null = null
let cachedMeta: PageMeta | null = null

/** Convert backend camelCase candidate to frontend type */
function mapCandidate(raw: any): Candidate {
  return {
    candidateId: raw.candidateId,
    candidateName: raw.candidateName,
    campaign: raw.campaign,
    assignedInvestigator: raw.assignedInvestigator,
    visitDate: raw.visitDate || '',
    status: (raw.status as HStatus) ?? 'Assigned',
    gender: raw.gender,
    phoneNumber: raw.phoneNumber,
    currentAddress: raw.currentAddress,
  }
}

/** Convert backend investigation detail to frontend InvestigationFormData */
function mapFormData(raw: any): InvestigationFormData {
  return {
    candidateId: raw.candidateId,
    candidateName: raw.candidateName,
    campaign: raw.campaign,
    gender: raw.gender || '',
    phoneNumber: raw.phoneNumber || '',
    currentAddress: raw.currentAddress || '',
    assignedInvestigator: raw.assignedInvestigator || '',
    currentStatus: (raw.currentStatus as HStatus) ?? 'Assigned',
    visitDate: raw.visitDate || '',
    location: raw.location || '',
    gpsCoordinates: raw.gpsCoordinates || '',
    peopleMet: raw.peopleMet || '',
    observations: raw.observations || '',
    findings: raw.findings || '',
    recommendation: raw.recommendation || '',
    reason: raw.reason || '',
  }
}

/** Convert backend attachment to frontend type */
function mapAttachment(raw: any): AttachmentFile {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type as AttachmentFile['type'],
    size: raw.size,
    uploadDate: raw.uploadDate,
    url: raw.url,
  }
}

export async function fetchPageMeta(): Promise<
  PageMeta
> {
  if (cachedMeta) return cachedMeta
  const { data } = await api.get('/home-investigation/meta')
  cachedMeta = data
  return data
}

export async function fetchCandidates(filters: CandidateFilters): Promise<Candidate[]> {
  const params: Record<string, string> = {}
  if (filters.search) params.search = filters.search
  if (filters.campaign) params.campaign = filters.campaign
  if (filters.investigator) params.investigator = filters.investigator
  if (filters.status) params.status = filters.status
  if (filters.dateFrom) params.dateFrom = filters.dateFrom
  if (filters.dateTo) params.dateTo = filters.dateTo

  const { data: response } = await api.get('/home-investigation/candidates', { params })
  const candidatesRaw = response.data ?? response ?? []
  return Array.isArray(candidatesRaw) ? candidatesRaw.map(mapCandidate) : []
}

export async function fetchFormData(candidateId: string): Promise<InvestigationFormData | null> {
  try {
    const { data } = await api.get(`/home-investigation/candidates/${candidateId}`)
    return mapFormData(data)
  } catch {
    return null
  }
}

export async function saveDraft(data: InvestigationFormData): Promise<InvestigationFormData> {
  const payload = {
    visitDate: data.visitDate,
    location: data.location,
    gpsCoordinates: data.gpsCoordinates,
    peopleMet: data.peopleMet,
    observations: data.observations,
    findings: data.findings,
    recommendation: data.recommendation,
    reason: data.reason,
  }
  const { data: response } = await api.put(`/home-investigation/candidates/${data.candidateId}/draft`, payload)
  return mapFormData(response)
}

export async function submitInvestigation(data: InvestigationFormData): Promise<InvestigationFormData> {
  const payload = {
    visitDate: data.visitDate,
    location: data.location,
    gpsCoordinates: data.gpsCoordinates,
    peopleMet: data.peopleMet,
    observations: data.observations,
    findings: data.findings,
    recommendation: data.recommendation,
    reason: data.reason,
  }
  const { data: response } = await api.put(`/home-investigation/candidates/${data.candidateId}/submit`, payload)
  return mapFormData(response)
}

export async function fetchAttachments(candidateId: string): Promise<AttachmentFile[]> {
  const { data: response } = await api.get(`/home-investigation/candidates/${candidateId}/attachments`)
  const attachmentsRaw = response.data ?? response ?? []
  return Array.isArray(attachmentsRaw) ? attachmentsRaw.map(mapAttachment) : []
}

export async function addAttachment(candidateId: string, file: File): Promise<AttachmentFile> {
  const formData = new FormData()
  formData.append('file', file, file.name)
  const { data: response } = await api.post(`/home-investigation/candidates/${candidateId}/attachments`, formData)
  return mapAttachment(response)
}

export async function removeAttachment(candidateId: string, attachmentId: string): Promise<void> {
  await api.delete(`/home-investigation/candidates/${candidateId}/attachments/${attachmentId}`)
}

export async function fetchCampaigns(): Promise<string[]> {
  if (cachedCampaigns) return cachedCampaigns
  const { data: response } = await api.get('/home-investigation/campaigns')
  cachedCampaigns = response.data ?? response ?? []
  return cachedCampaigns
}

export async function fetchInvestigators(): Promise<string[]> {
  if (cachedInvestigators) return cachedInvestigators
  const { data: response } = await api.get('/home-investigation/investigators')
  cachedInvestigators = response.data ?? response ?? []
  return cachedInvestigators
}

export async function fetchStatuses(): Promise<string[]> {
  if (cachedStatuses) return cachedStatuses
  const { data: response } = await api.get('/home-investigation/statuses')
  cachedStatuses = response.data ?? response ?? []
  return cachedStatuses
}
