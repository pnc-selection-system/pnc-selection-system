import type { PageMeta, Session, SessionFormData } from '../types/session'
import type { SessionFilterOptions, SessionFilters } from '../types/filter'

let sessions: Session[] = [
  { id: 's1', date: '2026-03-12', province: 'Battambang', school: 'Hun Sen HS', attendance: 84, convertedCount: 37 },
  { id: 's2', date: '2026-03-09', province: 'Siem Reap', school: 'Angkor HS', attendance: 62, convertedCount: 21 },
  { id: 's3', date: '2026-03-02', province: 'Phnom Penh', school: 'Bak Touk HS', attendance: 110, convertedCount: 52 },
]

export function fetchPageMeta(): PageMeta {
  return {
    breadcrumb: ['Outreach', 'Information sessions'],
    title: 'Information sessions',
    roles: ['Officer', 'Manager'],
    reqRange: ['FR-IS-1', 'FR-IS-6'],
  }
}

export function fetchFilterOptions(): SessionFilterOptions {
  return {
    provinces: ['All', 'Phnom Penh', 'Battambang', 'Siem Reap', 'Kampong Cham'],
    schools: ['All', 'Hun Sen HS', 'Angkor HS', 'Bak Touk HS'],
    dateRanges: ['All', 'Last 7 days', 'Last 30 days', 'This campaign'],
    campaignYears: [],
  }
}

export function fetchSessions(filters: SessionFilters): Session[] {
  let results = sessions
  if (filters.province && filters.province !== 'All') results = results.filter((s) => s.province === filters.province)
  if (filters.school && filters.school !== 'All') results = results.filter((s) => s.school === filters.school)
  return results
}

export function saveSession(form: SessionFormData): Session {
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
  return saved
}
