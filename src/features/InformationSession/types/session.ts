export interface SessionHost {
  id: number
  host_name: string
}

export interface Session {
  id: number
  campaign_id: number
  province_id?: number
  district_id?: number
  commune_id?: number
  village_id: number
  school_name: string
  session_date: string
  session_time: string
  expected_attendance: number
  attendance_count: number | null
  partner_type: string | null
  ngo_name: string | null
  hosts: SessionHost[]
  // location labels from API (optional, for display)
  province?: string
  district?: string
  commune?: string
  village?: string
}

export interface SessionFormData {
  id: number | null
  date: string
  time: string
  province_id: number | null
  district_id: number | null
  commune_id: number | null
  village_id: number | null
  school: string
  attendanceCount: number
  expectedAttendance: number
  partnerType: 'NGO' | 'Officer' | ''
  ngoName: string
  hostBy: string
  campaign_id: number | null
}

export const EMPTY_SESSION_FORM: SessionFormData = {
  id: null,
  date: '',
  time: '',
  province_id: null,
  district_id: null,
  commune_id: null,
  village_id: null,
  school: '',
  attendanceCount: 0,
  expectedAttendance: 0,
  partnerType: '',
  ngoName: '',
  hostBy: '',
  campaign_id: null,
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: string[]
  reqRange: [string, string]
}
