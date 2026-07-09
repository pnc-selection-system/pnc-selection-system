export type CandidateStatus = 'registered' | 'exam_done' | 'investigating' | 'assessed' | 'approved' | 'rejected' | 'on_hold'

export type ExamResult = 'pass' | 'fail' | null

export interface Candidate {
  id: string
  candidateCode: string
  fullName: string
  gender: 'M' | 'F'
  dateOfBirth: string
  age: number
  phone: string
  province: string
  address: string
  photoUrl?: string
  status: CandidateStatus
  organization: string
  roles: string[]
  requirements: string[]
  isDuplicate?: boolean
  examResult?: ExamResult
  examScore?: number
  // Education
  educationLevel?: string
  schoolName?: string
  major?: string
  graduationYear?: string
  gpa?: string
  // Socioeconomic
  familySize?: number
  monthlyIncome?: string
  occupation?: string
  housingType?: string
  hasDisability?: boolean
  disabilityType?: string
  // Exam & evaluation
  interviewScore?: number
  evaluatedBy?: string
  evaluationDate?: string
  evaluationNotes?: string
}

export const statusConfigs: Record<CandidateStatus, { label: string; bg: string; text: string; border: string }> = {
  registered: { label: 'Registered', bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' },
  exam_done: { label: 'Exam done', bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  investigating: { label: 'Investigating', bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
  assessed: { label: 'Assessed', bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  approved: { label: 'Approved', bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  rejected: { label: 'Rejected', bg: '#E5E7EB', text: '#374151', border: '#D1D5DB' },
  on_hold: { label: 'On Hold', bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
