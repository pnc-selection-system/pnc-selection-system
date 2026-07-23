import type {
  Investigation,
  InvestigationHistory,
  InvestigationFilters,
  DashboardStats,
  ChartData,
  InvestigatorWorkload,
  PaginationInfo,
} from '../types/investigation'
import type { Attachment } from '../types/attachment'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Mock investigators
const investigators = [
  { id: 'i1', name: 'Sokha N.' },
  { id: 'i2', name: 'Dara K.' },
  { id: 'i3', name: 'Vibol S.' },
]

// Mock campaigns
const campaigns = [
  '2025 Scholarship Program',
  '2026 Leadership Development',
  'Community Outreach 2025',
]

// Generate mock investigations
const now = new Date()
const attachmentsByInvestigation: Record<string, Attachment[]> = {}
const investigations: Investigation[] = [
  {
    id: 'inv1',
    candidateId: 'c1',
    candidateName: 'Sokha N.',
    candidatePhoto: 'https://i.pravatar.cc/150?u=c1',
    gender: 'Female',
    school: 'Battambang High School',
    campaign: '2025 Scholarship Program',
    investigatorId: 'i1',
    investigatorName: 'Dara K.',
    scheduledDate: '2026-03-15',
    visitDate: '2026-03-17',
    status: 'Approved',
    recommendation: 'Recommend',
    summary: 'Family is supportive, good academic performance',
    notes: 'Met with mother and younger sibling. House is in good condition.',
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-18T10:00:00Z',
    submittedAt: '2026-03-17T14:00:00Z',
    approvedAt: '2026-03-18T10:00:00Z',
  },
  {
    id: 'inv2',
    candidateId: 'c2',
    candidateName: 'Dara K.',
    candidatePhoto: 'https://i.pravatar.cc/150?u=c2',
    gender: 'Male',
    school: 'Siem Reap Secondary',
    campaign: '2026 Leadership Development',
    investigatorId: 'i2',
    investigatorName: 'Vibol S.',
    scheduledDate: '2026-03-20',
    visitDate: '2026-03-20',
    status: 'Submitted',
    recommendation: 'Recommend',
    summary: 'Strong leadership qualities observed',
    notes: 'Student showed excellent communication skills.',
    createdAt: '2026-03-12T09:00:00Z',
    updatedAt: '2026-03-20T16:00:00Z',
    submittedAt: '2026-03-20T16:00:00Z',
  },
  {
    id: 'inv3',
    candidateId: 'c3',
    candidateName: 'Vibol S.',
    candidatePhoto: 'https://i.pravatar.cc/150?u=c3',
    gender: 'Male',
    school: 'Kampong Cham High School',
    campaign: '2025 Scholarship Program',
    investigatorId: 'i3',
    investigatorName: 'Sokha N.',
    scheduledDate: '2026-03-22',
    status: 'In Progress',
    createdAt: '2026-03-14T10:00:00Z',
    updatedAt: '2026-03-14T10:00:00Z',
  },
  {
    id: 'inv4',
    candidateId: 'c4',
    candidateName: 'Chantha P.',
    candidatePhoto: 'https://i.pravatar.cc/150?u=c4',
    gender: 'Female',
    school: 'Phnom Penh International',
    campaign: '2026 Leadership Development',
    scheduledDate: '2026-03-25',
    status: 'Pending',
    createdAt: '2026-03-16T11:00:00Z',
    updatedAt: '2026-03-16T11:00:00Z',
  },
  {
    id: 'inv5',
    candidateId: 'c5',
    candidateName: 'Rith M.',
    candidatePhoto: 'https://i.pravatar.cc/150?u=c5',
    gender: 'Male',
    school: 'Siem Reap Secondary',
    campaign: 'Community Outreach 2025',
    investigatorId: 'i1',
    investigatorName: 'Dara K.',
    scheduledDate: '2026-03-18',
    visitDate: '2026-03-18',
    status: 'Rejected',
    recommendation: 'Not Recommend',
    summary: 'Does not meet criteria',
    notes: 'Family income exceeds threshold.',
    rejectionReason: 'Financial status does not meet eligibility criteria',
    createdAt: '2026-03-11T08:00:00Z',
    updatedAt: '2026-03-19T09:00:00Z',
    submittedAt: '2026-03-18T15:00:00Z',
    rejectedAt: '2026-03-19T09:00:00Z',
  },
  {
    id: 'inv6',
    candidateId: 'c6',
    candidateName: 'Srey P.',
    candidatePhoto: 'https://i.pravatar.cc/150?u=c6',
    gender: 'Female',
    school: 'Battambang High School',
    campaign: '2025 Scholarship Program',
    investigatorId: 'i2',
    investigatorName: 'Vibol S.',
    scheduledDate: '2026-03-28',
    status: 'Pending',
    createdAt: '2026-03-17T13:00:00Z',
    updatedAt: '2026-03-17T13:00:00Z',
  },
]

// Generate history for investigations
const history: InvestigationHistory[] = [
  {
    id: 'h1',
    investigationId: 'inv1',
    action: 'Created',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: '2026-03-10T08:00:00Z',
  },
  {
    id: 'h2',
    investigationId: 'inv1',
    action: 'Updated',
    userId: 'i1',
    userName: 'Dara K.',
    timestamp: '2026-03-17T14:00:00Z',
    notes: 'Visit completed',
  },
  {
    id: 'h3',
    investigationId: 'inv1',
    action: 'Submitted',
    userId: 'i1',
    userName: 'Dara K.',
    timestamp: '2026-03-17T14:00:00Z',
  },
  {
    id: 'h4',
    investigationId: 'inv1',
    action: 'Approved',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: '2026-03-18T10:00:00Z',
  },
  {
    id: 'h5',
    investigationId: 'inv2',
    action: 'Created',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: '2026-03-12T09:00:00Z',
  },
  {
    id: 'h6',
    investigationId: 'inv2',
    action: 'Submitted',
    userId: 'i2',
    userName: 'Vibol S.',
    timestamp: '2026-03-20T16:00:00Z',
  },
  {
    id: 'h7',
    investigationId: 'inv5',
    action: 'Created',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: '2026-03-11T08:00:00Z',
  },
  {
    id: 'h8',
    investigationId: 'inv5',
    action: 'Submitted',
    userId: 'i1',
    userName: 'Dara K.',
    timestamp: '2026-03-18T15:00:00Z',
  },
  {
    id: 'h9',
    investigationId: 'inv5',
    action: 'Rejected',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: '2026-03-19T09:00:00Z',
    notes: 'Financial status does not meet eligibility criteria',
  },
]

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const stats: DashboardStats = {
    pending: 0,
    inProgress: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    total: investigations.length,
  }

  investigations.forEach((inv) => {
    switch (inv.status) {
      case 'Pending':
        stats.pending++
        break
      case 'In Progress':
        stats.inProgress++
        break
      case 'Submitted':
        stats.submitted++
        break
      case 'Approved':
        stats.approved++
        break
      case 'Rejected':
        stats.rejected++
        break
    }
  })

  return wait(stats)
}

export async function fetchInvestigations(
  filters?: InvestigationFilters,
  pagination?: { page: number; pageSize: number },
): Promise<{ data: Investigation[]; pagination: PaginationInfo }> {
  let filtered = [...investigations]

  if (filters) {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (inv) =>
          inv.candidateName.toLowerCase().includes(search) ||
          inv.campaign.toLowerCase().includes(search) ||
          inv.investigatorName?.toLowerCase().includes(search),
      )
    }
    if (filters.campaign) {
      filtered = filtered.filter((inv) => inv.campaign === filters.campaign)
    }
    if (filters.investigatorId) {
      filtered = filtered.filter((inv) => inv.investigatorId === filters.investigatorId)
    }
    if (filters.status) {
      filtered = filtered.filter((inv) => inv.status === filters.status)
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((inv) => inv.scheduledDate >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filtered = filtered.filter((inv) => inv.scheduledDate <= filters.dateTo!)
    }
  }

  const total = filtered.length
  const pageSize = pagination?.pageSize || 10
  const page = pagination?.page || 1
  const start = (page - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)

  return wait({
    data: paginated,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
}

export async function fetchInvestigationById(id: string): Promise<Investigation | null> {
  const investigation = investigations.find((inv) => inv.id === id)
  return wait(investigation || null)
}

export async function fetchInvestigationHistory(investigationId: string): Promise<InvestigationHistory[]> {
  const investigationHistory = history.filter((h) => h.investigationId === investigationId)
  return wait(investigationHistory)
}

export async function createInvestigation(data: Partial<Investigation>): Promise<Investigation> {
  const newInvestigation: Investigation = {
    id: `inv${Date.now()}`,
    candidateId: data.candidateId || `c${Date.now()}`,
    candidateName: data.candidateName || '',
    candidatePhoto: data.candidatePhoto,
    gender: data.gender,
    school: data.school,
    campaign: data.campaign || '',
    investigatorId: data.investigatorId,
    investigatorName: data.investigatorName,
    scheduledDate: data.scheduledDate || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  investigations.push(newInvestigation)

  history.push({
    id: `h${Date.now()}`,
    investigationId: newInvestigation.id,
    action: 'Created',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
  })

  return wait(newInvestigation)
}

export async function updateInvestigation(id: string, data: Partial<Investigation>): Promise<Investigation> {
  const index = investigations.findIndex((inv) => inv.id === id)
  if (index === -1) throw new Error('Investigation not found')

  const existing = investigations[index]!
  const updated: Investigation = {
    ...existing,
    ...data,
    id: existing.id,
    candidateId: existing.candidateId,
    candidateName: existing.candidateName,
    campaign: existing.campaign,
    scheduledDate: existing.scheduledDate,
    status: existing.status,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  investigations[index] = updated

  history.push({
    id: `h${Date.now()}`,
    investigationId: id,
    action: 'Updated',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
  })

  return wait(updated)
}

export async function deleteInvestigation(id: string): Promise<void> {
  const index = investigations.findIndex((inv) => inv.id === id)
  if (index === -1) throw new Error('Investigation not found')

  investigations.splice(index, 1)
  await wait(undefined)
}

export async function submitInvestigation(id: string): Promise<Investigation> {
  const index = investigations.findIndex((inv) => inv.id === id)
  if (index === -1) throw new Error('Investigation not found')

  const investigation = investigations[index]!
  investigation.status = 'Submitted'
  investigation.submittedAt = new Date().toISOString()
  investigation.updatedAt = new Date().toISOString()

  history.push({
    id: `h${Date.now()}`,
    investigationId: id,
    action: 'Submitted',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
  })

  return wait(investigation)
}

export async function approveInvestigation(id: string): Promise<Investigation> {
  const index = investigations.findIndex((inv) => inv.id === id)
  if (index === -1) throw new Error('Investigation not found')

  const investigation = investigations[index]!
  investigation.status = 'Approved'
  investigation.approvedAt = new Date().toISOString()
  investigation.updatedAt = new Date().toISOString()

  history.push({
    id: `h${Date.now()}`,
    investigationId: id,
    action: 'Approved',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
  })

  return wait(investigation)
}

export async function rejectInvestigation(id: string, reason: string): Promise<Investigation> {
  const index = investigations.findIndex((inv) => inv.id === id)
  if (index === -1) throw new Error('Investigation not found')

  const investigation = investigations[index]!
  investigation.status = 'Rejected'
  investigation.rejectionReason = reason
  investigation.rejectedAt = new Date().toISOString()
  investigation.updatedAt = new Date().toISOString()

  history.push({
    id: `h${Date.now()}`,
    investigationId: id,
    action: 'Rejected',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
    notes: reason,
  })

  return wait(investigation)
}

export async function fetchChartData(): Promise<ChartData[]> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const data: ChartData[] = months.map((month) => ({
    month,
    count: Math.floor(Math.random() * 20) + 5,
  }))

  return wait(data)
}

export async function fetchInvestigatorWorkload(): Promise<InvestigatorWorkload[]> {
  const workload: InvestigatorWorkload[] = investigators.map((inv) => ({
    investigatorId: inv.id,
    investigatorName: inv.name,
    pending: investigations.filter((i) => i.investigatorId === inv.id && i.status === 'Pending').length,
    inProgress: investigations.filter((i) => i.investigatorId === inv.id && i.status === 'In Progress').length,
    submitted: investigations.filter((i) => i.investigatorId === inv.id && i.status === 'Submitted').length,
    total: investigations.filter((i) => i.investigatorId === inv.id).length,
  }))

  return wait(workload)
}

export async function fetchCampaigns(): Promise<string[]> {
  return wait(campaigns)
}

export async function fetchInvestigators(): Promise<{ id: string; name: string }[]> {
  return wait(investigators)
}

export async function saveDraft(detail: Partial<Investigation>): Promise<Investigation> {
  if (!detail.id) throw new Error('Investigation ID is required')
  const index = investigations.findIndex((inv) => inv.id === detail.id)
  if (index === -1) throw new Error('Investigation not found')

  const existing = investigations[index]!
  const updated: Investigation = {
    ...existing,
    ...detail,
    status: 'In Progress',
    updatedAt: new Date().toISOString(),
  }

  investigations[index] = updated

  history.push({
    id: `h${Date.now()}`,
    investigationId: detail.id,
    action: 'Updated',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
  })

  return wait(updated)
}

export async function submitForReview(detail: Partial<Investigation>): Promise<Investigation> {
  if (!detail.id) throw new Error('Investigation ID is required')
  const index = investigations.findIndex((inv) => inv.id === detail.id)
  if (index === -1) throw new Error('Investigation not found')

  const existing = investigations[index]!
  const updated: Investigation = {
    ...existing,
    ...detail,
    status: 'Submitted',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  investigations[index] = updated

  history.push({
    id: `h${Date.now()}`,
    investigationId: detail.id,
    action: 'Submitted',
    userId: 'admin',
    userName: 'Admin User',
    timestamp: new Date().toISOString(),
  })

  return wait(updated)
}

export async function addAttachment(investigationId: string, file: File): Promise<Attachment> {
  const attachment: Attachment = {
    id: `att-${Date.now()}`,
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'document',
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }
  attachmentsByInvestigation[investigationId] = [...(attachmentsByInvestigation[investigationId] ?? []), attachment]
  return wait(attachment)
}

export async function removeAttachment(investigationId: string, attachmentId: string): Promise<void> {
  const old = attachmentsByInvestigation[investigationId] ?? []
  const removed = old.find((a) => a.id === attachmentId)
  if (removed?.url) URL.revokeObjectURL(removed.url)
  attachmentsByInvestigation[investigationId] = old.filter((a) => a.id !== attachmentId)
  await wait(undefined)
}
