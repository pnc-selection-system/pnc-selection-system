import type { ContactPerson, PageMeta, Partner } from '../types/partner'
import type { CommunicationLogEntry } from '../types/communication'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let partners: Partner[] = [
  {
    id: 'p1',
    organisation: 'Future Light NGO',
    candidateCount: 48,
    status: 'Active',
    contacts: [
      { id: 'c1', name: 'Sopheak Lim', role: 'Director', phone: '+855 12 345 678' },
      { id: 'c2', name: 'Dara Chan', role: 'Coordinator', email: 'dara@futurelight.org' },
    ],
  },
  { id: 'p2', organisation: 'Hope Foundation', candidateCount: 31, status: 'Active', contacts: [] },
  { id: 'p3', organisation: 'Rural Reach', candidateCount: 12, status: 'Inactive', contacts: [] },
]

const logsByPartner: Record<string, CommunicationLogEntry[]> = {
  p1: [
    { id: 'l1', date: '2026-03-14', channel: 'Email', summary: 'Shared shortlist of 12 candidates' },
    { id: 'l2', date: '2026-03-03', channel: 'Call', summary: 'Confirmed session attendance' },
  ],
}

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    title: 'NGOs & partners',
    roles: ['Officer', 'Manager'],
    reqRange: ['FR-NGO-1', 'FR-NGO-5'],
  })
}

export async function fetchPartners(): Promise<Partner[]> {
  return wait(partners)
}

export async function fetchCommunicationLog(partnerId: string): Promise<CommunicationLogEntry[]> {
  return wait(logsByPartner[partnerId] ?? [])
}

export async function addPartner(organisation: string): Promise<Partner> {
  const existingPartner = partners.find(
    (p) => p.organisation.toLowerCase() === organisation.toLowerCase()
  )
  if (existingPartner) {
    throw new Error('A partner with this name already exists')
  }
  
  const created: Partner = {
    id: `p${partners.length + 1}`,
    organisation,
    candidateCount: 0,
    status: 'Active',
    contacts: [],
  }
  partners = [...partners, created]
  return wait(created)
}

export async function addContact(partnerId: string, contact: Omit<ContactPerson, 'id'>): Promise<ContactPerson> {
  const created: ContactPerson = { ...contact, id: `c${Date.now()}` }
  partners = partners.map((p) =>
    p.id === partnerId ? { ...p, contacts: [...p.contacts, created] } : p,
  )
  return wait(created)
}

export async function addLogEntry(
  partnerId: string,
  entry: Omit<CommunicationLogEntry, 'id'>,
): Promise<CommunicationLogEntry> {
  const created: CommunicationLogEntry = { ...entry, id: `l${Date.now()}` }
  logsByPartner[partnerId] = [created, ...(logsByPartner[partnerId] ?? [])]
  return wait(created)
}