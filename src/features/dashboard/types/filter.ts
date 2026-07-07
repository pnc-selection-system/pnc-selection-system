export interface DashboardFilters {
  campaign: string
  province: string
  status: string
}

export interface FilterOptions {
  campaigns: string[]
  provinces: string[]
  statuses: string[]
}

export const DEFAULT_FILTERS: DashboardFilters = {
  campaign: '2026',
  province: 'All',
  status: 'All',
}