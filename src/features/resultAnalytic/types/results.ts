export type PublishStatus = 'draft' | 'published'

export interface ExamRound {
  id: string
  label: string
}

export interface RoleAction {
  role: string
  action: string
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: RoleAction[]
  reqRange: [string, string]
}

export interface SummaryStats {
  satExam: number
  passed: number
  failed: number
  passRate: number
}

export interface ScoreBucket {
  rangeLabel: string
  count: number
  isModal: boolean
}

export interface ScoreDistribution {
  buckets: ScoreBucket[]
  avg: number
  median: number
  passLine: number
}