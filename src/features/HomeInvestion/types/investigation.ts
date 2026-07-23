export type InvestigationStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected'

export interface Investigation {
  id: string
  candidateId: string
  candidateName: string
  candidatePhoto?: string
  gender?: string
  school?: string
  campaign: string
  investigatorId?: string
  investigatorName?: string
  scheduledDate: string
  visitDate?: string
  status: InvestigationStatus
  recommendation?: 'Recommend' | 'Not Recommend'
  summary?: string
  notes?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  rejectedAt?: string
}

export interface InvestigationHistory {
  id: string
  investigationId: string
  action: 'Created' | 'Updated' | 'Submitted' | 'Approved' | 'Rejected'
  userId: string
  userName: string
  timestamp: string
  notes?: string
}

export interface InvestigationFilters {
  search?: string
  campaign?: string
  investigatorId?: string
  status?: InvestigationStatus
  dateFrom?: string
  dateTo?: string
}

export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface DashboardStats {
  pending: number
  inProgress: number
  submitted: number
  approved: number
  rejected: number
  total: number
}

export interface ChartData {
  month: string
  count: number
}

export interface InvestigatorWorkload {
  investigatorId: string
  investigatorName: string
  pending: number
  inProgress: number
  submitted: number
  total: number
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'document'
  url?: string
}
