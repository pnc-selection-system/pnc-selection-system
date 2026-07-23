import type { Pinia } from 'pinia'
import { fetchPartners, fetchContactPersons, fetchCommunicationLog } from '@/features/ngosPartner/service/service'
import { useCandidateStore } from '@/features/CandidateList/stores/candidateStore'
import { getCandidate } from '@/features/CandidateList/services/candidateService'
import { fetchProvinces } from '@/features/CandidateList/services/provinceService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { setProvinceNameCache, setNgoNameCache } from '@/features/CandidateList/utils/mapper'
import type { ContactPerson } from '@/features/ngosPartner/types/partner'
import type { CommunicationLogEntry } from '@/features/ngosPartner/types/communication'

// ---------------------------------------------------------------------------
// NGO Partners cache
// ---------------------------------------------------------------------------
let partnersCache: Awaited<ReturnType<typeof fetchPartners>> | null = null
let partnersPromise: Promise<typeof partnersCache> | null = null

export function getCachedPartners() {
  if (!partnersCache) {
    try {
      const raw = sessionStorage.getItem('ngoPartners')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          partnersCache = parsed
        }
      }
    } catch {}
  }
  return partnersCache
}

function setCachedPartners(data: Awaited<ReturnType<typeof fetchPartners>>) {
  partnersCache = data
  try {
    sessionStorage.setItem('ngoPartners', JSON.stringify(data))
  } catch {}
}

export function prefetchNgoPartners() {
  if (!partnersPromise) {
    partnersPromise = fetchPartners()
      .then((data) => {
        setCachedPartners(data)
        if (data && data[0]) {
          return prefetchNgoPartnerDetails(data[0].id)
        }
        return data
      })
      .catch(() => {
        return null
      })
  }
  return partnersPromise
}

export function clearPartnersCache() {
  partnersCache = null
  partnersPromise = null
  try {
    sessionStorage.removeItem('ngoPartners')
  } catch {}
}

// ---------------------------------------------------------------------------
// NGO partner contacts / logs cache (by partner ID)
// ---------------------------------------------------------------------------
let contactsCache: Record<number, ContactPerson[]> = {}
let logsCache: Record<number, CommunicationLogEntry[]> = {}

export function getCachedContacts(partnerId: number): ContactPerson[] | undefined {
  if (!contactsCache[partnerId]) {
    try {
      const raw = sessionStorage.getItem(`ngoContacts:${partnerId}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          contactsCache[partnerId] = parsed
        }
      }
    } catch {}
  }
  return contactsCache[partnerId]
}

export function getCachedLogs(partnerId: number): CommunicationLogEntry[] | undefined {
  if (!logsCache[partnerId]) {
    try {
      const raw = sessionStorage.getItem(`ngoLogs:${partnerId}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          logsCache[partnerId] = parsed
        }
      }
    } catch {}
  }
  return logsCache[partnerId]
}

export function prefetchNgoPartnerDetails(partnerId: number) {
  return Promise.all([
    fetchContactPersons(partnerId).then((data) => {
      contactsCache[partnerId] = data
      try {
        sessionStorage.setItem(`ngoContacts:${partnerId}`, JSON.stringify(data))
      } catch {}
    }).catch(() => {}),
    fetchCommunicationLog(partnerId).then((data) => {
      logsCache[partnerId] = data
      try {
        sessionStorage.setItem(`ngoLogs:${partnerId}`, JSON.stringify(data))
      } catch {}
    }).catch(() => {}),
  ])
}

export function setCachedContacts(partnerId: number, data: ContactPerson[]) {
  contactsCache[partnerId] = data
  try {
    sessionStorage.setItem(`ngoContacts:${partnerId}`, JSON.stringify(data))
  } catch {}
}

export function setCachedLogs(partnerId: number, data: CommunicationLogEntry[]) {
  logsCache[partnerId] = data
  try {
    sessionStorage.setItem(`ngoLogs:${partnerId}`, JSON.stringify(data))
  } catch {}
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
  if (!provincesCache) {
    try {
      const raw = sessionStorage.getItem('sharedProvinces')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          provincesCache = parsed
        }
      }
    } catch {}
  }
  return provincesCache
}

export function getSharedNgos(): NgoPartner[] | null {
  if (!ngosCache) {
    try {
      const raw = sessionStorage.getItem('sharedNgos')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          ngosCache = parsed
        }
      }
    } catch {}
  }
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
      try {
        sessionStorage.setItem('sharedProvinces', JSON.stringify(provinces))
        sessionStorage.setItem('sharedNgos', JSON.stringify(ngos))
      } catch {}

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
// Information Sessions cache (route-level prefetch)
// ---------------------------------------------------------------------------
import { fetchSessions, fetchProvinces as fetchInfoSessionProvinces } from '@/features/InformationSession/service/service'
import { DEFAULT_SESSION_FILTERS } from '@/features/InformationSession/types/filter'

let sessionsPrefetchPromise: Promise<void> | null = null

export function prefetchInfoSessions() {
  if (!sessionsPrefetchPromise) {
    sessionsPrefetchPromise = Promise.all([
      fetchSessions(DEFAULT_SESSION_FILTERS, 1, 10),
      fetchCampaigns(),
      fetchInfoSessionProvinces(),
    ]).then(([sessionsResult, campaigns, provinces]) => {
      // Store to sessionStorage using the same keys that useInfoSessions/hydrateFromStorage reads
      try {
        sessionStorage.setItem(
          'informationSessions:sessions',
          JSON.stringify({ sessions: sessionsResult.data, total: sessionsResult.total }),
        )
        sessionStorage.setItem('informationSessions:campaigns', JSON.stringify(campaigns))
      } catch { /* quota exceeded, ignore */ }
    }).catch(() => {
      // Allow retry on next navigation
      sessionsPrefetchPromise = null
    })
  }
  return sessionsPrefetchPromise
}

export function clearInfoSessionsPrefetch() {
  sessionsPrefetchPromise = null
}

// ---------------------------------------------------------------------------
// Candidate List prefetch (uses Pinia store directly)
// ---------------------------------------------------------------------------
const CANDIDATES_SESSION_KEY = 'candidates'

function readCandidatesFromStorage(): { candidates: any[]; total: number } | null {
  try {
    const raw = sessionStorage.getItem(CANDIDATES_SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.candidates)) {
        return parsed
      }
    }
  } catch {}
  return null
}

function writeCandidatesToStorage(candidates: any[], total: number): void {
  try {
    sessionStorage.setItem(CANDIDATES_SESSION_KEY, JSON.stringify({ candidates, total }))
  } catch {}
}

export function prefetchCandidateList(pinia: Pinia) {
  const store = useCandidateStore(pinia)

  // Hydrate from sessionStorage if store is empty (e.g., after browser refresh)
  if (store.candidates.length === 0 && !store.loading) {
    const cached = readCandidatesFromStorage()
    if (cached) {
      store.candidates = cached.candidates
      store.total = cached.total
    }
  }

  // Only fetch from API if still empty after hydration
  if (store.candidates.length === 0 && !store.loading) {
    return store.fetchCandidates().then(() => {
      writeCandidatesToStorage(store.candidates, store.total)
    })
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
