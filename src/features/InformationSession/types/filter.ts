export interface LocationOption {
  id: number
  name: string
}

export interface SessionFilters {
  province: string
  dateRange: string
  partnerType?: string
}

export interface SessionFilterOptions {
  provinces: LocationOption[]
  dateRanges: string[]
  campaignYears: string[]
  partnerTypes: string[]
}

export const DEFAULT_SESSION_FILTERS: SessionFilters = {
  province: '',
  dateRange: '',
  partnerType: '',
}
