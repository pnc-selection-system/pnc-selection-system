export type NgoPartnerStatus = 'Active' | 'Inactive'

export interface NgoPartner {
  id: number
  name: string
  type: string
  address: string
  phone: string
  email: string
  active: boolean
  status: NgoPartnerStatus
  created_at: string
  updated_at: string
}

export interface ContactPerson {
  id: number
  ngo_partner_id: number
  full_name: string
  email: string
  phone: string
  role: string | null
  created_at: string
  updated_at: string
  ngo_partner?: NgoPartner
}

export interface NgoPartnerFormData {
  name: string
  type?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
  status?: NgoPartnerStatus
}

export interface ContactPersonFormData {
  full_name: string
  email?: string
  phone?: string
  role?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PageMeta {
  title: string
  roles: string[]
  reqRange: [string, string]
}