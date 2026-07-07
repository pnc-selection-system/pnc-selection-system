export interface Session {
  id: string
  date: string // ISO yyyy-mm-dd
  province: string
  school: string
  attendance: number
  convertedCount: number
}

export interface SessionFormData {
  id: string | null
  date: string
  province: string
  school: string
  attendanceCount: number
  campaign: string
  participantList: string
}
export const EMPTY_SESSION_FORM: SessionFormData = {
  id: null,
  date: '',
  province: '',
  school: '',
  attendanceCount: 0,
  campaign: '2026',
  participantList: '',
}
export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: string[]
  reqRange: [string, string]
}