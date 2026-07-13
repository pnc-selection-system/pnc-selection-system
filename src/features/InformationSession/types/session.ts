import type { LocationSelection } from './location'

export type SessionStatus = 'Upcoming' | 'Completed' | 'Cancelled'
export type PartnerType = 'ngo' | 'pnc'

export interface InterestedStudent {
  id: string
  name: string
}

export interface Session {
  id: string
  date: string // ISO yyyy-mm-dd
  province: string
  school: string
  pncOrNgo: string
  attendance: number
  candidateCount: number
  partnerOrOfficer: string
}

export interface SessionFormData {
  id: string | null
  partnerType: PartnerType
  ngoName: string
  ngoContact: string
  date: string
  time: string
  status: SessionStatus
  location: LocationSelection
  school: string
  hostedBy: string
  totalAttendees: number
  interestedStudents: InterestedStudent[]
}

export const EMPTY_SESSION_FORM: SessionFormData = {
  id: null,
  partnerType: 'ngo',
  ngoName: '',
  ngoContact: '',
  date: '',
  time: '09:00 AM',
  status: 'Upcoming',
  location: { province: '', district: '', commune: '', village: '' },
  school: '',
  hostedBy: '',
  totalAttendees: 0,
  interestedStudents: [],
}

export interface PageMeta {
  breadcrumb: string[]
  title: string
}