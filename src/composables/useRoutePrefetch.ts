import type { Pinia } from 'pinia'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import { useCandidateStore } from '@/features/CandidateList/stores/candidateStore'
import { getCandidate } from '@/features/CandidateList/services/candidateService'
import { fetchProvinces } from '@/features/CandidateList/services/provinceService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { setProvinceNameCache, setNgoNameCache } from '@/features/CandidateList/utils/mapper'

// ---------------------------------------------------------------------------
// NGO Partners cache
// ---------------------------------------------------------------------------
let partnersCache: Awaited<ReturnType<typeof fetchPartners>> | null = null
let partnersPromise: Promise<typeof partnersCache> | null = null

export function getCachedPartners() {
  return partnersCache
}

export function prefetchNgoPartners() {
  if (!partnersPromise) {
    partnersPromise = fetchPartners()
      .then((data) => {
        partnersCache = data
        return data
      })
      .catch(() => {
        // API error — navigation still proceeds, component will fetch on mount
        return null
      })
  }
  return partnersPromise
}

export function clearPartnersCache() {
  partnersCache = null
  partnersPromise = null
}

// ---------------------------------------------------------------------------
// Shared cache for provinces and NGOs (full data, shared by store + filter)
// ---------------------------------------------------------------------------
import type { ProvinceData } from '@/features/CandidateList/services/provinceService'
import type { NgoPartner } from '@/features/ngosPartner/types/partner'

let provincesCache: ProvinceData[] | null = null
let ngosCache: NgoPartner[] | null = null
let lookupPromise: Promise<void> | null = null

export function getSharedProvinces(): ProvinceData[] | null {
  return provincesCache
}

export function getSharedNgos(): NgoPartner[] | null {
  return ngosCache
}

/**
 * Pre-fetch provinces and NGOs into a shared cache.
 * Also populates the mapper name caches so candidate display works immediately.
 */
export function prefetchProvincesAndNgos() {
  if (!lookupPromise) {
    lookupPromise = Promise.all([
      fetchProvinces(),
      fetchPartners(),
    ]).then(([provinces, ngos]) => {
      provincesCache = provinces
      ngosCache = ngos
      // Also populate mapper name caches for instant candidate display
      const provinceNames: Record<number, string> = {}
      provinces.forEach((p) => { provinceNames[p.id] = p.name })
      setProvinceNameCache(provinceNames)

      const ngoNames: Record<number, string> = {}
      if (Array.isArray(ngos)) {
        ngos.forEach((p) => { ngoNames[p.id] = p.name })
      }
      setNgoNameCache(ngoNames)
    }).catch(() => {
      lookupPromise = null // allow retry on next navigation
    })
  }
  return lookupPromise
}

// ---------------------------------------------------------------------------
// Candidate List prefetch (uses Pinia store directly)
// ---------------------------------------------------------------------------
export function prefetchCandidateList(pinia: Pinia) {
  const store = useCandidateStore(pinia)
  // Only fetch if not already loaded
  if (store.candidates.length === 0 && !store.loading) {
    return store.fetchCandidates()
  }
  return Promise.resolve()
}

// ---------------------------------------------------------------------------
// Candidate Profile cache (by ID) — stores mapped Candidate type, not raw API data
// ---------------------------------------------------------------------------
import type { Candidate } from '@/features/candidateProfile/types/index'
import { apiCandidateToProfileCandidate, ensureProvinceCache } from '@/features/candidateProfile/service/service'

const profileCache = new Map<string, Promise<void>>()
const profileDataCache = new Map<string, Candidate | null>()

export function getCachedCandidateProfile(id: string): Candidate | null {
  return profileDataCache.get(id) ?? null
}

export function prefetchCandidateProfile(id: string): Promise<void> {
  if (!profileCache.has(id)) {
    // Also ensure province names are available for mapping
    const promise = Promise.all([
      getCandidate(Number(id)),
      prefetchProvincesAndNgos(),
      ensureProvinceCache(),
    ])
      .then(([apiData]) => {
        const mapped = apiCandidateToProfileCandidate(apiData)
        profileDataCache.set(id, mapped)
      })
      .catch(() => {
        profileDataCache.set(id, null)
      })
    profileCache.set(id, promise)
  }
  return profileCache.get(id)!
}

export function clearProfileCache(id?: string) {
  if (id) {
    profileCache.delete(id)
    profileDataCache.delete(id)
  } else {
    profileCache.clear()
    profileDataCache.clear()
  }
}
