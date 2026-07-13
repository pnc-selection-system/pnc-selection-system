export interface SessionFilters {
  province: string
  school: string
  pncNgo: string
  dateRange: string
}

export interface SessionFilterOptions {
  provinces: string[]
  schools: string[]
  pncNgoOptions: string[]
  dateRanges: string[]
}

export const DEFAULT_SESSION_FILTERS: SessionFilters = {
  province: 'All',
  school: '',
  pncNgo: 'All',
  dateRange: 'All',
}