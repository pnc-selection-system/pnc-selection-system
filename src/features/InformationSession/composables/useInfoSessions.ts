import { ref } from 'vue'
import { fetchSessions, fetchProvinces, fetchFilterOptions, fetchSessionById, saveSession } from '../service/service'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { DEFAULT_SESSION_FILTERS, type SessionFilterOptions, type SessionFilters } from '../types/filter'
import { CampaignStatus } from '@/enums'
import type { Campaign } from '@/features/campaign/types'
import type { Session, SessionFormData } from '../types/session'

// Keys for sessionStorage persistence
const CAMPAIGNS_SESSION_KEY = 'informationSessions:campaigns'
const SESSIONS_SESSION_KEY = 'informationSessions:sessions'
const FILTERS_SESSION_KEY = 'informationSessions:filters'

function hydrateFromStorage() {
  // Hydrate campaigns from sessionStorage
  try {
    const raw = sessionStorage.getItem(CAMPAIGNS_SESSION_KEY)
    if (raw) {
      campaigns.value = JSON.parse(raw)
    }
  } catch {}

  // Hydrate sessions from sessionStorage
  try {
    const raw = sessionStorage.getItem(SESSIONS_SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.sessions)) {
        sessions.value = parsed.sessions
        total.value = parsed.total ?? 0
      }
    }
  } catch {}

  // Hydrate filters from sessionStorage
  try {
    const raw = sessionStorage.getItem(FILTERS_SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed) {
        filters.value = { ...filters.value, ...parsed }
      }
    }
  } catch {}
}

function persistToStorage() {
  try {
    sessionStorage.setItem(CAMPAIGNS_SESSION_KEY, JSON.stringify(campaigns.value))
    sessionStorage.setItem(SESSIONS_SESSION_KEY, JSON.stringify({ sessions: sessions.value, total: total.value }))
    sessionStorage.setItem(FILTERS_SESSION_KEY, JSON.stringify(filters.value))
  } catch {}
}

// Module-level state — persists across route changes
const sessions = ref<Session[]>([])
const campaigns = ref<Campaign[]>([])
const filterOptions = ref<SessionFilterOptions>(fetchFilterOptions())
const filters = ref<SessionFilters>({ ...DEFAULT_SESSION_FILTERS })
const currentPage = ref(1)
const total = ref(0)
const isLoading = ref(false)       // only true on very first load
const isBootstrapped = ref(false)
const detailCache = new Map<number, Session>()
const pageCache = new Map<string, Session[]>()

function pageCacheKey(page: number) {
  return `${page}|${filters.value.province}|${filters.value.partnerType}|${filters.value.campaignYear}|${filters.value.startDate}|${filters.value.endDate}`
}

export function useInfoSessions() {
  // Hydrate from sessionStorage on module load so the first render is instant
  hydrateFromStorage()

  // Internal: fetch and swap — never clears existing rows
  async function _fetchSessions(page = currentPage.value) {
    const result = await fetchSessions(filters.value, page, 10)
    result.data.forEach(s => detailCache.set(s.id, s))
    pageCache.set(pageCacheKey(page), result.data)
    if (page === currentPage.value) {
      sessions.value = result.data
      total.value = result.total
      persistToStorage()
    }
    return result
  }

  function _prefetchNext(page: number, totalPages: number) {
    const next = page + 1
    if (next <= totalPages && !pageCache.has(pageCacheKey(next))) {
      _fetchSessions(next).catch(() => {})
    }
  }

  async function _refreshCampaigns() {
    try {
      const data = await fetchCampaigns()
      campaigns.value = data
      const years = [...new Set(data.map(c => String(c.year)))].sort().reverse()
      const campaignDates = data.map(c => ({
        year: c.year,
        start_date: c.start_date?.split('T')[0] ?? '',
        end_date: c.end_date?.split('T')[0] ?? '',
      }))
      filterOptions.value = { ...filterOptions.value, campaignYears: years, campaignDates }
      sessionStorage.setItem(CAMPAIGNS_SESSION_KEY, JSON.stringify(data))
    } catch {}
  }

  async function bootstrap() {
    if (!isBootstrapped.value) {
      // Only show loading if we have no cached data to display instantly.
      // The route-level prefetch (prefetchInfoSessions) already ran during
      // navigation, so on first load the data may already be in sessionStorage
      // and hydrated by hydrateFromStorage() above.
      const hasCachedData = sessions.value.length > 0
      if (!hasCachedData) isLoading.value = true
      try {
        await Promise.all([
          _fetchSessions().then(result => {
            const totalPages = Math.ceil(result.total / 10)
            _prefetchNext(1, totalPages)
          }),
          _refreshCampaigns(),
          fetchProvinces().then(provinces => {
            filterOptions.value = { ...filterOptions.value, provinces }
          }),
        ])
      } finally {
        isLoading.value = false
        isBootstrapped.value = true
      }
      return
    }
    // Subsequent visits: refresh campaigns & sessions silently in background.
    // Module-level refs persist across route changes, so the table renders
    // instantly from cache while fresh data loads in the background.
    _refreshCampaigns()
    _fetchSessions().then(result => {
      const totalPages = Math.ceil(result.total / 10)
      _prefetchNext(currentPage.value, totalPages)
    })
  }

  // Pagination: serve from cache instantly, fetch if missing, always pre-fetch next
  async function setPage(page: number) {
    currentPage.value = page
    const cached = pageCache.get(pageCacheKey(page))
    if (cached) {
      sessions.value = cached
      // Refresh this page silently and pre-fetch next
      _fetchSessions(page).then(result => {
        const totalPages = Math.ceil(result.total / 10)
        _prefetchNext(page, totalPages)
      }).catch(() => {})
      return
    }
    // Not cached — fetch and wait, then pre-fetch next
    const result = await _fetchSessions(page)
    const totalPages = Math.ceil(result.total / 10)
    _prefetchNext(page, totalPages)
  }

  // Filter change: serve from cache if available, otherwise fetch
  function applyFilters() {
    currentPage.value = 1
    const cached = pageCache.get(pageCacheKey(1))
    if (cached) {
      sessions.value = cached
      // Refresh silently in background
      _fetchSessions(1).then(result => {
        const totalPages = Math.ceil(result.total / 10)
        _prefetchNext(1, totalPages)
      }).catch(() => {})
      return
    }
    _fetchSessions(1).then(result => {
      const totalPages = Math.ceil(result.total / 10)
      _prefetchNext(1, totalPages)
    }).catch(() => {})
  }

  // Create: save via API, then prepend the returned session immediately to
  // the table. No background re-fetch is done because fetchSessions silently
  // returns empty data on failure, which would overwrite the table with nothing.
  // The session will appear fresly on next page load or filter change.
  async function createSession(form: SessionFormData): Promise<Session> {
    const saved = await saveSession(form)
    sessions.value = [saved, ...sessions.value].slice(0, 10)
    total.value += 1
    pageCache.clear()
    currentPage.value = 1
    persistToStorage()
    return saved
  }

  // Edit: save via API, then update the session in-place immediately.
  // Same reasoning as createSession — no background re-fetch to avoid
  // overwriting the table with empty data if the API call fails.
  async function updateSession(form: SessionFormData): Promise<Session> {
    const saved = await saveSession(form)
    sessions.value = sessions.value.map(s => s.id === saved.id ? saved : s)
    pageCache.clear()
    persistToStorage()
    return saved
  }

  async function getSession(id: number): Promise<Session | null> {
    const cached = detailCache.get(id) ?? sessions.value.find(s => s.id === id) ?? null
    if (cached) {
      // Refresh in background
      fetchSessionById(id).then(fresh => detailCache.set(id, fresh)).catch(() => {})
      return cached
    }
    const fresh = await fetchSessionById(id)
    detailCache.set(id, fresh)
    return fresh
  }

  function getActiveCampaignId(): number | null {
    return campaigns.value.find(c => c.status === CampaignStatus.Active)?.id ?? null
  }

  return {
    sessions,
    campaigns,
    filterOptions,
    filters,
    currentPage,
    total,
    isLoading,
    bootstrap,
    setPage,
    applyFilters,
    createSession,
    updateSession,
    getSession,
    getActiveCampaignId,
  }
}
