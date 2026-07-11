import type { AssignedVisit, PageMeta, VisitDetail, VisitStatus } from '../types/visit'
import type { Attachment } from '../types/attachment'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const assignedVisits: AssignedVisit[] = [
  { id: 'v1', candidateId: 'c1', candidateName: 'Sokha N.', province: 'Battambang', status: 'In progress' },
  { id: 'v2', candidateId: 'c2', candidateName: 'Dara K.', province: 'Siem Reap', status: 'Assigned' },
  { id: 'v3', candidateId: 'c3', candidateName: 'Vibol S.', province: 'Kampong Cham', status: 'Submitted' },
]

const visitDetails: Record<string, VisitDetail> = {
  c1: {
    candidateId: 'c1',
    candidateName: 'Sokha N.',
    status: 'In progress',
    visitDate: '2026-03-17',
    location: '',
    peopleMet: 'Mother, younger sibling',
    observations: '',
    findings: '',
  },
}

const attachmentsByCandidate: Record<string, Attachment[]> = {
  c1: [
    { id: 'a1', name: 'IMG_0142.jpg', type: 'image' },
    { id: 'a2', name: 'IMG_0143.jpg', type: 'image' },
  ],
}

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Evaluation', 'Home Investigation'],
    title: 'Home investigation',
    roles: [
      { role: 'Investigator', scope: 'own only' },
      { role: 'Manager', scope: 'all' },
    ],
    reqRange: ['FR-HI-1', 'FR-HI-6'],
  })
}

export async function fetchAssignedVisits(): Promise<AssignedVisit[]> {
  return wait(assignedVisits)
}

export async function fetchVisitDetail(candidateId: string): Promise<VisitDetail> {
  const visit = assignedVisits.find((v) => v.candidateId === candidateId)
  return wait(
    visitDetails[candidateId] ?? {
      candidateId,
      candidateName: visit?.candidateName ?? '',
      status: visit?.status ?? 'Assigned',
      visitDate: '',
      location: '',
      peopleMet: '',
      observations: '',
      findings: '',
    },
  )
}

export async function fetchAttachments(candidateId: string): Promise<Attachment[]> {
  return wait(attachmentsByCandidate[candidateId] ?? [])
}

export async function saveDraft(detail: VisitDetail): Promise<VisitDetail> {
  const updated: VisitDetail = { ...detail, status: 'In progress' }
  visitDetails[detail.candidateId] = updated
  return wait(updated)
}

export async function submitForReview(detail: VisitDetail): Promise<VisitDetail> {
  const updated: VisitDetail = { ...detail, status: 'Submitted' }
  visitDetails[detail.candidateId] = updated
  return wait(updated)
}

export async function addAttachment(candidateId: string, file: File): Promise<Attachment> {
  const created: Attachment = {
    id: `a${Date.now()}`,
    name: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'document',
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }
  attachmentsByCandidate[candidateId] = [...(attachmentsByCandidate[candidateId] ?? []), created]
  return wait(created)
}

export async function removeAttachment(candidateId: string, attachmentId: string): Promise<void> {
  const old = attachmentsByCandidate[candidateId] ?? []
  const removed = old.find((a) => a.id === attachmentId)
  if (removed?.url) URL.revokeObjectURL(removed.url)
  attachmentsByCandidate[candidateId] = old.filter((a) => a.id !== attachmentId)
  await wait(undefined)
}