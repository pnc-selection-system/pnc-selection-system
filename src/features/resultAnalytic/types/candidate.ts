export interface SubjectScores {
  math: number
  khmer: number
  eng: number
  logic: number
}

export interface CandidateResultRow {
  rank: number
  candidate: string
  scores: SubjectScores
  total: number
  result: 'Pass' | 'Fail'
}

export const SUBJECT_WEIGHTS = {
  math: '40%',
  khmer: '25%',
  eng: '20%',
  logic: '15%',
} as const