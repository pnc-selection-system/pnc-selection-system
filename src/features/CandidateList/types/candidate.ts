export interface Candidate {
  id: number
  student_id: string | null
  campaign_id: number | null
  ngo_id: number | null
  province_id: number
  candidate_no: string
  fullName: string
  fullName_KH: string
  gender: 'Male' | 'Female'
  dateOfBirth: string
  phone: string
  schoolName: string
  province: string
  ngo: string
  exam_score: number | null
  exam_result: 'Pass' | 'Fail' | null
  status: string
}
