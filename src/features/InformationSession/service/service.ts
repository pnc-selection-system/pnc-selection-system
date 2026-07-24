import api from '@/plugins/axios'
import type { PageMeta, Session, SessionFormData } from '../types/session'
import type { LocationOption, SessionFilterOptions, SessionFilters } from '../types/filter'

export function fetchPageMeta(): PageMeta {
  return {
    breadcrumb: ['Outreach', 'Information sessions'],
    title: 'Information sessions',
    roles: ['Officer', 'Manager'],
    reqRange: ['FR-IS-1', 'FR-IS-6'],
  }
}

export async function fetchProvinces(): Promise<LocationOption[]> {
  try {
    const { data } = await api.get('/provinces')
    return data.data ?? data ?? []
  } catch (error) {
    console.error('Error fetching provinces:', error)
    return []
  }
}

export async function fetchDistricts(province_id: number): Promise<LocationOption[]> {
  try {
    const { data } = await api.get('/districts', { params: { province_id } })
    return data.data ?? data ?? []
  } catch (error) {
    console.error('Error fetching districts:', error)
    return []
  }
}

export async function fetchCommunes(district_id: number): Promise<LocationOption[]> {
  try {
    const { data } = await api.get('/communes', { params: { district_id } })
    return data.data ?? data ?? []
  } catch (error) {
    console.error('Error fetching communes:', error)
    return []
  }
}

export async function fetchVillages(commune_id: number): Promise<LocationOption[]> {
  try {
    const { data } = await api.get('/villages', { params: { commune_id } })
    return data.data ?? data ?? []
  } catch (error) {
    console.error('Error fetching villages:', error)
    return []
  }
}

export function fetchFilterOptions(): SessionFilterOptions {
  return {
    provinces: [],
    campaignYears: [],
    campaignDates: [],
    partnerTypes: ['School', 'Alumni', 'NGO', 'Officer'],
  }
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}

/** Flatten nested location objects into flat string labels for display */
export function flattenLocationLabels(session: Session): Session {
  return session
}

export async function fetchSessions(
  filters: SessionFilters,
  page: number = 1,
  perPage: number = 10,
  campaign_id?: number | null
): Promise<PaginatedResult<Session>> {
  try {
    const params: Record<string, string | number> = {
      page,
      per_page: perPage,
    }
    if (campaign_id) params.campaign_id = campaign_id
    if (filters.province) params.province = filters.province
    if (filters.partnerType) params.partner_type = filters.partnerType
    // When we have a precise date range (start_date + end_date), use that exclusively.
    // Avoid sending campaign_year alongside the date range, because the backend may
    // prioritize campaign_year and return all sessions from that year instead of the
    // specific date window.
    if (filters.startDate && filters.endDate) {
      params.start_date = filters.startDate
      params.end_date = filters.endDate
    } else {
      if (filters.campaignYear) params.campaign_year = filters.campaignYear
      if (filters.startDate) params.start_date = filters.startDate
      if (filters.endDate) params.end_date = filters.endDate
    }

    const response = await api.get('/info-sessions', { params })
    // Laravel returns paginated: { success, data: { current_page, data: [sessions], total, last_page, per_page, ... } }
    const paginated = response.data.data ?? response.data
    const rawData: Session[] = paginated.data ?? paginated ?? []
    return {
      data: rawData.map(flattenLocationLabels),
      total: paginated.total ?? 0,
      currentPage: paginated.current_page ?? page,
      lastPage: paginated.last_page ?? 1,
      perPage: paginated.per_page ?? perPage,
    }
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return { data: [], total: 0, currentPage: page, lastPage: 1, perPage }
  }
}

export async function saveSession(form: SessionFormData): Promise<Session> {
  try {
    const payload: Record<string, unknown> = {
      campaign_id: form.campaign_id,
      province_id: form.province_id,
      district_id: form.district_id,
      commune_id: form.commune_id,
      village_id: form.village_id,
      school_name: form.partnerType === 'School' || form.partnerType === 'NGO' || form.partnerType === 'Officer' ? '' : form.school,
      session_date: form.date,
      venue: form.venue || null,
      expected_attendance: form.expectedAttendance || 1,
      attendance_count: form.attendanceCount || 0,
      partner_type: form.partnerType || null,
      partner_name: form.partnerName || null,
      location: form.location || null,
      department: form.department || null,
      generation: form.generation || null,
      hosts: form.hosts
        .filter(h => h.name.trim() !== '')
        .map(h => ({ host_by: h.name.trim() })),
    }

    if (form.id) {
      const response = await api.put(`/info-sessions/${form.id}`, payload)
      const result = response.data.data
      const session = result?.data ?? result ?? response.data
      return flattenLocationLabels(session as Session)
    } else {
      const response = await api.post('/info-sessions', payload)
      const result = response.data.data
      const session = result?.data ?? result ?? response.data
      return flattenLocationLabels(session as Session)
    }
  } catch (error: any) {
    console.error('[saveSession] Error:', error?.response?.data?.message || error?.message)
    throw error
  }
}

export async function fetchSessionById(id: number): Promise<Session> {
  const { data } = await api.get(`/info-sessions/${id}`)
  const session = data.data ?? data
  return flattenLocationLabels(session)
}

export async function deleteSession(id: number): Promise<void> {
  try {
    await api.delete(`/info-sessions/${id}`)
  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}
