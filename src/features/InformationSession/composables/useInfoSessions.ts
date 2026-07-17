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
  return `${page}|${filters.value.province}|${filters.value.partnerType}|${filters.value.dateRange}`
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

  async function bootstrap() {
    if (!isBootstrapped.value) {
      isLoading.value = true
      try {
        await Promise.all([
          _fetchSessions().then(result => {
            const totalPages = Math.ceil(result.total / 10)
            _prefetchNext(1, totalPages)
          }),
          fetchCampaigns().then(data => {
            campaigns.value = data
            const years = [...new Set(data.map(c => String(c.year)))].sort().reverse()
            filterOptions.value = { ...filterOptions.value, campaignYears: years }
          }).catch(() => {}),
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
    // Subsequent visits: data already visible, silently refresh in background
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

  // Create: optimistically prepend, then confirm with real data
  async function createSession(form: SessionFormData): Promise<Session> {
    const saved = await saveSession(form)
    pageCache.clear()
    sessions.value = [saved, ...sessions.value].slice(0, 10)
    total.value += 1
    detailCache.set(saved.id, saved)
    return saved
  }

  // Edit: optimistically update in-place, then confirm with real data
  async function updateSession(form: SessionFormData): Promise<Session> {
    const saved = await saveSession(form)
    pageCache.clear()
    const idx = sessions.value.findIndex(s => s.id === saved.id)
    if (idx !== -1) sessions.value[idx] = saved
    detailCache.set(saved.id, saved)
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
