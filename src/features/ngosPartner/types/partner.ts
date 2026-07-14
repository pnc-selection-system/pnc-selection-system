export type PartnerStatus = 'Active' | 'Inactive'

export interface ContactPerson {
  id: string
  name: string
  role: string
  phone?: string
  email?: string
}

export interface Partner {
  id: string
  organisation: string
  candidateCount: number
  status: PartnerStatus
  contacts: ContactPerson[]
}

export interface PageMeta {
  title: string
  roles: string[]
  reqRange: [string, string]
}