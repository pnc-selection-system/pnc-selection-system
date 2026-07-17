export interface Candidate {
  id: number
  candidate_no: string
  name: string
  province: string
  ngo: string
  exam_score: number | null
  exam_result: 'Pass' | 'Fail' | null
  status: string
}
