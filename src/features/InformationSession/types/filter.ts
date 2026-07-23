export interface LocationOption {
  id: number
  name: string
}

export interface SessionFilters {
  province: string
  campaignYear: string
  startDate: string
  endDate: string
  partnerType?: string
}

export interface CampaignDateInfo {
  year: number
  start_date: string
  end_date: string
}

export interface SessionFilterOptions {
  provinces: LocationOption[]
  campaignYears: string[]
  campaignDates: CampaignDateInfo[]
  partnerTypes: string[]
}

export const DEFAULT_SESSION_FILTERS: SessionFilters = {
  province: '',
  campaignYear: '',
  startDate: '',
  endDate: '',
  partnerType: '',
}
