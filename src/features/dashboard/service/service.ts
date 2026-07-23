import api from '@/plugins/axios'
import type { DashboardData } from '../types/dashboard'
import type { DashboardFilters, FilterOptions } from '../types/filter'

// --- Campaign / Province helpers ---

interface CampaignItem {
  id: number
  name?: string
  year?: string
}

interface ProvinceItem {
  id: number
  name: string
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  try {
    const [campaignsRes, provincesRes] = await Promise.all([
      api.get('/selection-campaigns'),
      api.get('/provinces'),
    ])

    const campaignsData = (campaignsRes.data as any)?.data ?? campaignsRes.data
    const campaigns: string[] = Array.isArray(campaignsData)
      ? campaignsData.map((c: CampaignItem) => c.year ?? c.name ?? String(c.id))
      : []

    const provincesData = (provincesRes.data as any)?.data ?? provincesRes.data
    const provinces: string[] = Array.isArray(provincesData)
      ? provincesData.map((p: ProvinceItem) => p.name)
      : []

    return {
      campaigns: ['All', ...campaigns],
      provinces: ['All', ...provinces],
      statuses: ['All', 'Open', 'Closed'],
    }
  } catch {
    return {
      campaigns: ['All', '2026', '2025', '2024'],
      provinces: ['All'],
      statuses: ['All', 'Open', 'Closed'],
    }
  }
}

export async function fetchDashboardData(filters: DashboardFilters): Promise<DashboardData> {
  // Fetch real data from multiple endpoints
  try {
    // Try to get investigation dashboard stats
    const statsRes = await api.get('/home-investigation/dashboard/stats').catch(() => null)
    const investigationStats = statsRes?.data ?? {}

    // Try to get candidate stats
    const candidatesRes = await api.get('/candidates', { params: { per_page: 1 } }).catch(() => null)
    const candidateMeta = (candidatesRes?.data as any)?.meta ?? (candidatesRes?.data as any)?.data
    const totalCandidates = candidateMeta?.total ?? 0

    // Try to get investigation dashboard workload & chart
    const workloadRes = await api.get('/home-investigation/dashboard/workload').catch(() => null)
    const chartRes = await api.get('/home-investigation/dashboard/chart').catch(() => null)

    const workloadData = (workloadRes?.data as any)?.data ?? []
    const chartData = (chartRes?.data as any)?.data ?? []

    const submitted = investigationStats.submitted ?? 0
    const approved = investigationStats.approved ?? 0
    const rejected = investigationStats.rejected ?? 0
    const totalInvestigations = investigationStats.total ?? 0

    return {
      stats: [
        { key: 'candidates', label: 'Candidates', value: String(totalCandidates), delta: 'Registered' },
        { key: 'exam_pass_rate', label: 'Investigations done', value: String(totalInvestigations), delta: `${submitted} submitted` },
        { key: 'investigations_done', label: 'Approved', value: String(approved), delta: `${rejected} rejected` },
        { key: 'selected', label: 'Selected', value: String(approved), delta: '+pending review' },
      ],
      funnel: [
        { label: 'Registered', value: totalCandidates },
        { label: 'Investigated', value: totalInvestigations },
        { label: 'Submitted', value: submitted },
        { label: 'Approved', value: approved },
        { label: 'Rejected', value: rejected },
        { label: 'Selected', value: approved },
      ],
      outcome: {
        pass: approved,
        fail: rejected,
        pending: submitted - approved - rejected,
      },
      provinces: [],
      yearOverYear: chartData.map((item: { month: string; count: number }) => ({
        label: item.month,
        value2025: 0,
        value2026: item.count,
      })),
      yearOverYearTag: 'FR-DR-3',
    }
  } catch {
    // Fallback to empty if all APIs fail
    return {
      stats: [
        { key: 'candidates', label: 'Candidates', value: '0', delta: 'No data' },
        { key: 'exam_pass_rate', label: 'Exam pass rate', value: '0%', delta: 'No data' },
        { key: 'investigations_done', label: 'Investigations done', value: '0', delta: 'No data' },
        { key: 'selected', label: 'Selected', value: '0', delta: 'No data' },
      ],
      funnel: [],
      outcome: { pass: 0, fail: 0, pending: 0 },
      provinces: [],
      yearOverYear: [],
      yearOverYearTag: 'FR-DR-3',
    }
  }
}