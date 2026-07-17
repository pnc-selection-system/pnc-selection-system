export type VisitStatus = 'Assigned' | 'In progress' | 'Submitted'

export interface AssignedVisit {
  id: string
  candidateId: string
  candidateName: string
  province: string
  status: VisitStatus
}

export interface VisitDetail {
  candidateId: string
  candidateName: string
  status: VisitStatus
  visitDate: string // ISO yyyy-mm-dd
  location: string
  peopleMet: string
  observations: string
  findings: string
}

export interface RoleScope {
  role: string
  scope: string
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: RoleScope[]
  reqRange: [string, string]
}