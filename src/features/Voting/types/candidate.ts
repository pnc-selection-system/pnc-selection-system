export type InvestigationRecommendation = 'Recommended' | 'Not recommended'
export type NeedIndex = 'Low' | 'Medium' | 'High'

export interface ShortlistCandidate {
  id: string
  name: string
  votesCast: number
  totalVoters: number
}

export interface ConsolidatedProfile {
  candidateId: string
  candidateName: string
  photoUrl?: string
  examScore: number
  examRank: number
  assessmentPercent: number
  investigationRecommendation: InvestigationRecommendation
  needIndex: NeedIndex
  storyNotes: string
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: string[]
  reqRange: [string, string]
}