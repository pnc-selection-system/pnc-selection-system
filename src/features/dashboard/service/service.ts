import type { DashboardData } from '../types/dashboard'
import type { DashboardFilters, FilterOptions } from '../types/filter'

function wait<T>(value: T): Promise<T> {
  return Promise.resolve(value)
}

/**
 * Replace the body of these functions with real HTTP calls, e.g.:
 * const { data } = await axios.get('/api/dashboard', { params: filters })
 */

export async function fetchFilterOptions(): Promise<FilterOptions> {
  return wait({
    campaigns: ['2026', '2025', '2024'],
    provinces: ['All', 'Phnom Penh', 'Battambang', 'Siem Reap', 'Kampong Cham'],
    statuses: ['All', 'Open', 'Closed'],
  })
}

export async function fetchDashboardData(filters: DashboardFilters): Promise<DashboardData> {
  // `filters` would normally be forwarded as query params to the API.
  return wait({
    stats: [
      { key: 'candidates', label: 'Candidates', value: '1,248', delta: '+312 vs 2025' },
      { key: 'exam_pass_rate', label: 'Exam pass rate', value: '61%', delta: '762 passed' },
      { key: 'investigations_done', label: 'Investigations done', value: '418', delta: 'of 540 assigned' },
      { key: 'selected', label: 'Selected', value: '96', delta: '+18 waitlist' },
    ],
    funnel: [
      { label: 'Registered', value: 1248 },
      { label: 'Sat exam', value: 1040 },
      { label: 'Passed', value: 762 },
      { label: 'Assessed', value: 610 },
      { label: 'Investigated', value: 418 },
      { label: 'Selected', value: 96 },
    ],
    outcome: { pass: 62, fail: 26, pending: 12 },
    provinces: [
      { province: 'Phnom Penh', rate: 74 },
      { province: 'Battambang', rate: 63 },
      { province: 'Siem Reap', rate: 51 },
      { province: 'Kampong Cham', rate: 58 },
    ],
    yearOverYear: [
      { label: 'Jan', value2025: 40, value2026: 58 },
      { label: 'Feb', value2025: 62, value2026: 74 },
      { label: 'Mar', value2025: 45, value2026: 47 },
      { label: 'Apr', value2025: 58, value2026: 80 },
      { label: 'May', value2025: 50, value2026: 52 },
      { label: 'Jun', value2025: 60, value2026: 78 },
    ],
    yearOverYearTag: 'FR-DR-3',
  })
}