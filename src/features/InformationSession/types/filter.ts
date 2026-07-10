export interface SessionFilters {
  province: string
  school: string
  dateRange: string
}
export interface SessionFilterOptions {
  provinces: string[]
  schools: string[]
  dateRanges: string[]
  campaignYears: string[]
}
export const DEFAULT_SESSION_FILTERS: SessionFilters = {
  province: '',
  school: '',
  dateRange: '',
}
