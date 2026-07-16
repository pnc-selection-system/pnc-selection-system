import type { CandidateApiData, CandidateApiPayload } from '../types/api'
import type { Candidate } from '../types/candidate'

/**
 * Campaign ID to campaign name lookup cache
 */
let campaignNameCache: Record<number, string> = {}

/**
 * Province ID to province name lookup cache
 */
let provinceNameCache: Record<number, string> = {}

/**
 * NGO ID to NGO name lookup cache
 */
let ngoNameCache: Record<number, string> = {}

/**
 * Check if the campaign name cache has been populated
 */
export function hasCampaignCache(): boolean {
  return Object.keys(campaignNameCache).length > 0
}

/**
 * Set the campaign name lookup cache
 */
export function setCampaignNameCache(cache: Record<number, string>) {
  campaignNameCache = cache
}

/**
 * Check if the province name cache has been populated
 */
export function hasProvinceCache(): boolean {
  return Object.keys(provinceNameCache).length > 0
}

/**
 * Set the province name lookup cache
 */
export function setProvinceNameCache(cache: Record<number, string>) {
  provinceNameCache = cache
}

/**
 * Check if the NGO name cache has been populated
 */
export function hasNgoCache(): boolean {
  return Object.keys(ngoNameCache).length > 0
}

/**
 * Set the NGO name lookup cache
 */
export function setNgoNameCache(cache: Record<number, string>) {
  ngoNameCache = cache
}

/**
 * Convert backend API candidate data to frontend Candidate format
 */
export function apiCandidateToFrontend(apiCandidate: CandidateApiData): Candidate {
  return {
    id: apiCandidate.id,
    campaign_id: apiCandidate.campaign_id,
    ngo_id: apiCandidate.ngo_id,
    province_id: apiCandidate.province_id,
    candidate_no: `C-${String(apiCandidate.id).padStart(3, '0')}`,
    fullName: `${apiCandidate.first_name} ${apiCandidate.last_name}`,
    fullName_KH: apiCandidate.first_name_kh && apiCandidate.last_name_kh
      ? `${apiCandidate.first_name_kh} ${apiCandidate.last_name_kh}`
      : '',
    gender: apiCandidate.gender,
    dateOfBirth: apiCandidate.dob?.split('T')[0] ?? '',
    phone: apiCandidate.phone || '',
    schoolName: apiCandidate.school_name || '',
    province: provinceNameCache[apiCandidate.province_id] || apiCandidate.province || '',
    ngo: apiCandidate.ngo_id ? ngoNameCache[apiCandidate.ngo_id] || '' : '',
    status: apiCandidate.status,
    exam_score: null,
    exam_result: null,
  }
}

/**
 * Convert frontend Candidate form data to backend API payload format
 */
export function frontendFormToApiPayload(form: {
  firstName: string
  lastName: string
  firstNameKH: string
  lastNameKH: string
  gender: 'Male' | 'Female'
  dateOfBirth: string
  phone: string
  schoolName: string
  campaign_id: number | null
  ngo_id: number | null
  province_id: number
  status: string
}): CandidateApiPayload {
  return {
    campaign_id: form.campaign_id,
    ngo_id: form.ngo_id,
    province_id: form.province_id,
    school_name: form.schoolName || null,
    first_name: form.firstName,
    last_name: form.lastName,
    first_name_kh: form.firstNameKH || null,
    last_name_kh: form.lastNameKH || null,
    gender: form.gender,
    dob: form.dateOfBirth,
    phone: form.phone || null,
    status: form.status,
  }
}

/**
 * Convert full name into first and last name (splits on last space)
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim()
  const lastSpaceIndex = trimmed.lastIndexOf(' ')
  if (lastSpaceIndex === -1) {
    return { firstName: trimmed, lastName: '' }
  }
  return {
    firstName: trimmed.slice(0, lastSpaceIndex),
    lastName: trimmed.slice(lastSpaceIndex + 1),
  }
}
