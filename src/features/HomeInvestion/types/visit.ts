export type HStatus = 'Assigned' | 'In Progress' | 'Submitted'

export interface Candidate {
  candidateId: string
  candidateName: string
  campaign: string
  assignedInvestigator: string
  visitDate: string
  status: HStatus
  gender?: string
  phoneNumber?: string
  currentAddress?: string
}

export interface InvestigationFormData {
  candidateId: string
  candidateName: string
  campaign: string
  gender: string
  phoneNumber: string
  currentAddress: string
  assignedInvestigator: string
  currentStatus: HStatus
  visitDate: string
  location: string
  gpsCoordinates: string
  peopleMet: string
  observations: string
  findings: string
  recommendation: string
  reason: string
}

export type AttachmentStatus = 'uploading' | 'completed' | 'pending' | 'error'

export interface AttachmentFile {
  id: string
  name: string
  type: 'image' | 'pdf' | 'docx'
  size: number
  uploadDate: string
  url?: string
  status?: AttachmentStatus
  errorMessage?: string
}

export interface CandidateFilters {
  search: string
  campaign: string
  investigator: string
  status: string
  dateFrom: string
  dateTo: string
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: { role: string; scope: string }[]
  reqRange: [string, string]
}
