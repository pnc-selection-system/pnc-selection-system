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
  village_id?: number
  school_name: string
  session_date: string
  venue: string | null
  expected_attendance: number
  attendance_count: number | null
  partner_type: string | null
  partner_name: string | null
  location: string | null
  department: string | null
  generation: string | null
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
  province_id: number | null
  district_id: number | null
  commune_id: number | null
  village_id: number | null
  school: string
  venue: string
  attendanceCount: number
  expectedAttendance: number
  partnerType: 'School' | 'Alumni' | 'NGO' | 'Officer' | ''
  partnerName: string
  location: string
  department: string
  generation: string
  hosts: { name: string }[]
  createdBy: { name: string }[]
  createByInput: string
  campaign_id: number | null
}

export const EMPTY_SESSION_FORM: SessionFormData = {
  id: null,
  date: '',
  province_id: null,
  district_id: null,
  commune_id: null,
  village_id: null,
  school: '',
  venue: '',
  attendanceCount: 0,
  expectedAttendance: 1,
  partnerType: '',
  partnerName: '',
  location: '',
  department: '',
  generation: '',
  hosts: [],
  createdBy: [],
  createByInput: '',
  campaign_id: null,
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: string[]
  reqRange: [string, string]
}
