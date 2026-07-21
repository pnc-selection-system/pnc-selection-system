import { ref } from 'vue'
import { fetchSessions, fetchProvinces, fetchFilterOptions, fetchSessionById, saveSession } from '../service/service'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { DEFAULT_SESSION_FILTERS, type SessionFilterOptions, type SessionFilters } from '../types/filter'
import { CampaignStatus } from '@/enums'
import type { Campaign } from '@/features/campaign/types'
import type { Session, SessionFormData } from '../types/session'

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
  // Internal: fetch and swap — never clears existing rows
  async function _fetchSessions(page = currentPage.value) {
    const result = await fetchSessions(filters.value, page, 10)
    result.data.forEach(s => detailCache.set(s.id, s))
    pageCache.set(pageCacheKey(page), result.data)
    if (page === currentPage.value) {
      sessions.value = result.data
      total.value = result.total
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
    } catch {}
  }

  async function bootstrap() {
    if (!isBootstrapped.value) {
      isLoading.value = true
      try {
        await Promise.all([
          _fetchSessions().then(result => {
            const totalPages = Math.ceil(result.total / 10)
            _prefetchNext(1, totalPages)
          }),
          _refreshCampaigns(),
          fetchProvinces().then(provinces => {
            filterOptions.value = { ...filterOptions.value, provinces }
          }).catch(() => {}),
        ])
      } finally {
        isLoading.value = false
        isBootstrapped.value = true
      }
      return
    }
    // Subsequent visits: refresh campaigns & sessions silently in background
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
    return saved
  }

  // Edit: save via API, then update the session in-place immediately.
  // Same reasoning as createSession — no background re-fetch to avoid
  // overwriting the table with empty data if the API call fails.
  async function updateSession(form: SessionFormData): Promise<Session> {
    const saved = await saveSession(form)
    sessions.value = sessions.value.map(s => s.id === saved.id ? saved : s)
    pageCache.clear()
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
