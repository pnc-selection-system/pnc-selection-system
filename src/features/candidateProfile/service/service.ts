import { getCandidate as apiGetCandidate, updateCandidateStatus as apiUpdateStatus } from '@/features/CandidateList/services/candidateService'
import { fetchProvinces } from '@/features/CandidateList/services/provinceService'
import type { CandidateApiData } from '@/features/CandidateList/types/api'
import type { Candidate, CandidateStatus } from '../types/index'

/**
 * Cache for province ID to province name lookups
 */
let provinceNameCache: Record<number, string> = {}
let provinceCacheLoaded = false

async function ensureProvinceCache(): Promise<void> {
  if (provinceCacheLoaded) return
  try {
    const provinces = await fetchProvinces()
    for (const p of provinces) {
      provinceNameCache[p.id] = p.name
    }
    provinceCacheLoaded = true
  } catch {
    // Province names are optional; silently fail
  }
}

/**
 * Map API candidate data to the profile Candidate type
 */
function apiCandidateToProfileCandidate(api: CandidateApiData): Candidate {
  const statusMap: Record<string, CandidateStatus> = {
    'Registered': 'registered',
    'Exam Done': 'exam_done',
    'Investigating': 'investigating',
    'Assessed': 'assessed',
    'Approved': 'approved',
    'Rejected': 'rejected',
    'On Hold': 'on_hold',
  }

  function calculateAge(dob: string): number {
    if (!dob) return 0
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return {
    id: String(api.id),
    candidateCode: `C-${String(api.id).padStart(3, '0')}`,
    fullName: `${api.first_name} ${api.last_name}`,
    gender: api.gender === 'Male' ? 'M' : 'F',
    dateOfBirth: api.dob?.split('T')[0] ?? '',
    age: calculateAge(api.dob),
    phone: api.phone || '',
    province: provinceNameCache[api.province_id] || api.province || '',
    address: '',
    status: statusMap[api.status] || 'registered',
    organization: '',
    roles: [],
    requirements: [],
    schoolName: api.school_name || '',
    examResult: null,
    examScore: undefined,
  }
}

export function useCandidateProfile() {
  /**
   * Fetch a candidate by ID from the API
   */
  async function getCandidateById(id: string): Promise<Candidate | null> {
    try {
      const [apiData] = await Promise.all([
        apiGetCandidate(Number(id)),
        ensureProvinceCache(),
      ])
      return apiCandidateToProfileCandidate(apiData)
    } catch {
      return null
    }
  }

  /**
   * Update a candidate's status via the API
   */
  async function updateCandidateStatus(id: string, status: CandidateStatus): Promise<void> {
    try {
      await apiUpdateStatus(Number(id), status)
    } catch {
      // Error handled silently — the profile page will show the current state
    }
  }

  /**
   * Update a candidate's photo
   * Note: Requires a photo upload API endpoint to be implemented
   */
  async function updateCandidatePhoto(_id: string, _photoUrl: string): Promise<void> {
    // Photo upload not yet implemented via API
  }

  return {
    getCandidateById,
    updateCandidateStatus,
    updateCandidatePhoto,
  }
}
