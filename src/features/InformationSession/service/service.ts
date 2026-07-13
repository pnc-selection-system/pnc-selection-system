import type { PageMeta, Session, SessionFormData } from '../types/session'
import type { SessionFilterOptions, SessionFilters } from '../types/filter'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let sessions: Session[] = [
  { id: 's1', date: '2026-03-12', province: 'Battambang', school: 'Preah Monivong High School', pncOrNgo: 'Future Light NGO', attendance: 84, candidateCount: 37, partnerOrOfficer: 'Sopheak Lim' },
  { id: 's2', date: '2026-03-09', province: 'Siem Reap', school: 'Hun Sen Wat Svay High School', pncOrNgo: 'Hope Foundation', attendance: 62, candidateCount: 21, partnerOrOfficer: 'Dara Chan' },
  { id: 's3', date: '2026-03-02', province: 'Phnom Penh', school: 'Bak Touk High School', pncOrNgo: 'PNC Outreach', attendance: 110, candidateCount: 52, partnerOrOfficer: '' },
]

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Outreach', 'Information Sessions'],
    title: 'Information sessions',

  })
}

export async function fetchFilterOptions(): Promise<SessionFilterOptions> {
  return wait({
    provinces: ['All', 'Phnom Penh', 'Battambang', 'Siem Reap', 'Kampong Cham'],
    schools: ['All', 'Preah Monivong High School', 'Hun Sen Wat Svay High School', 'Bak Touk High School'],
    pncNgoOptions: ['All', 'Future Light NGO', 'Hope Foundation', 'PNC Outreach'],
    dateRanges: ['All', 'Last 7 days', 'Last 30 days', 'This campaign'],
  })
}

export async function fetchSessions(filters: SessionFilters): Promise<Session[]> {
  let results = sessions
  if (filters.province !== 'All') results = results.filter((s) => s.province === filters.province)
  if (filters.school) results = results.filter((s) => s.school.toLowerCase().includes(filters.school.toLowerCase()))
  if (filters.pncNgo !== 'All') results = results.filter((s) => s.pncOrNgo === filters.pncNgo)
  return wait(results)
}

export async function saveSession(form: SessionFormData): Promise<Session> {
  const saved: Session = {
    id: form.id ?? `s${sessions.length + 1}`,
    date: form.date,
    province: form.location.province,
    school: form.school,
    pncOrNgo: form.partnerType === 'ngo' ? form.ngoName : 'PNC',
    attendance: form.totalAttendees,
    candidateCount: form.interestedStudents.length,
    partnerOrOfficer: form.ngoContact,
  }
  sessions = form.id ? sessions.map((s) => (s.id === form.id ? saved : s)) : [saved, ...sessions]
  return wait(saved)
}

// --- Cross-module lookup: partner names, read-only, no store needed ---
export async function fetchPartnerNames(): Promise<string[]> {
  // In the real app this calls NGOsPartners/service.ts's fetchPartners() directly
  // instead of duplicating partner data here.
  return wait(['Future Light NGO', 'Hope Foundation', 'Rural Reach'])
}


// --- Location cascade (reference data) ---
export async function fetchProvinces(): Promise<string[]> {
  return wait(['Phnom Penh', 'Battambang', 'Siem Reap', 'Kampong Cham'])
}

export async function fetchDistricts(province: string): Promise<string[]> {
  const map: Record<string, string[]> = {
    'Phnom Penh': ['Chamkarmon', 'Daun Penh', 'Toul Kork'],
    Battambang: ['Battambang', 'Bavel', 'Thma Koul'],
    'Siem Reap': ['Siem Reap', 'Angkor Chum', 'Chi Kraeng'],
    'Kampong Cham': ['Kampong Cham', 'Batheay', 'Cheung Prey'],
  }
  return wait(map[province] ?? [])
}

export async function fetchCommunes(district: string): Promise<string[]> {
  return wait(district ? [`${district} Commune 1`, `${district} Commune 2`] : [])
}

export async function fetchVillages(commune: string): Promise<string[]> {
  return wait(commune ? [`${commune} Village 1`, `${commune} Village 2`] : [])
}

export async function fetchSchoolsByProvince(province: string): Promise<string[]> {
  const map: Record<string, string[]> = {
    'Phnom Penh': ['Bak Touk High School', 'Chea Sim Samaki High School'],
    Battambang: ['Preah Monivong High School', 'Hun Sen Battambang High School'],
    'Siem Reap': ['Hun Sen Wat Svay High School', 'Angkor High School'],
    'Kampong Cham': ['Kampong Cham High School'],
  }
  return wait(map[province] ?? [])
}