import type { PageMeta, Session, SessionFormData } from '../types/session'
import type { SessionFilterOptions, SessionFilters } from '../types/filter'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let sessions: Session[] = [
  { id: 's1', date: '2026-03-12', province: 'Battambang', school: 'Hun Sen HS', attendance: 84, convertedCount: 37 },
  { id: 's2', date: '2026-03-09', province: 'Siem Reap', school: 'Angkor HS', attendance: 62, convertedCount: 21 },
  { id: 's3', date: '2026-03-02', province: 'Phnom Penh', school: 'Bak Touk HS', attendance: 110, convertedCount: 52 },
]

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Outreach', 'Information sessions'],
    title: 'Information sessions',
    roles: ['Officer', 'Manager'],
    reqRange: ['FR-IS-1', 'FR-IS-6'],
  })
}

export async function fetchFilterOptions(): Promise<SessionFilterOptions> {
  return wait({
    provinces: ['All', 'Phnom Penh', 'Battambang', 'Siem Reap', 'Kampong Cham'],
    schools: ['All', 'Hun Sen HS', 'Angkor HS', 'Bak Touk HS'],
    dateRanges: ['All', 'Last 7 days', 'Last 30 days', 'This campaign'],
  })
}

export async function fetchSessions(filters: SessionFilters): Promise<Session[]> {
  // `filters` would normally be forwarded as query params to the API.
  let results = sessions
  if (filters.province !== 'All') results = results.filter((s) => s.province === filters.province)
  if (filters.school !== 'All') results = results.filter((s) => s.school === filters.school)
  return wait(results)
}

export async function saveSession(form: SessionFormData): Promise<Session> {
  const saved: Session = {
    id: form.id ?? `s${sessions.length + 1}`,
    date: form.date,
    province: form.province,
    school: form.school,
    attendance: form.attendanceCount,
    convertedCount: 0,
  }
  sessions = form.id
    ? sessions.map((s) => (s.id === form.id ? saved : s))
    : [saved, ...sessions]
  return wait(saved)
}