export interface StatCard {
  key: string
  label: string
  value: string
  delta?: string
}

export interface FunnelStage {
  label: string
  value: number
}

export interface OutcomeSplit {
  pass: number
  fail: number
  pending: number
}

export interface ProvincePassRate {
  province: string
  rate: number // 0-100
}

export interface YearComparisonPoint {
  label: string
  value2025: number
  value2026: number
}

export interface DashboardData {
  stats: StatCard[]
  funnel: FunnelStage[]
  outcome: OutcomeSplit
  provinces: ProvincePassRate[]
  yearOverYear: YearComparisonPoint[]
  yearOverYearTag?: string
}