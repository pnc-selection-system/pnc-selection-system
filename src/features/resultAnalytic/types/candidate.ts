/**
 * Dynamic subject scores — keys are subject names from the database.
 * Each value is the candidate's final score for that subject.
 */
export interface SubjectScores {
  [subjectName: string]: number | null
}

export interface CandidateResultRow {
  rank: number
  candidate: string
  student_id?: string
  scores: SubjectScores
  total: number
  result: 'Pass' | 'Fail'
}
