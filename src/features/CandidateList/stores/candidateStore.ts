import { defineStore } from 'pinia'
import type { Candidate } from '../types/candidate'
import { apiCandidateToFrontend, frontendFormToApiPayload, hasCampaignCache, hasNgoCache, hasProvinceCache, setCampaignNameCache, setNgoNameCache, setProvinceNameCache, splitFullName } from '../utils/mapper'
import * as candidateService from '../services/candidateService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { fetchProvinces } from '../services/provinceService'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import { getErrorMessage } from '@/utils/error'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    loading: false,
    saving: false,
    error: null as string | null,
    allCandidates: [] as Candidate[],
    candidates: [] as Candidate[],
    page: 1,
    perPage: 10,
    total: 0,
    search: '',
    province_id: null as number | null,
    ngo_id: null as number | null,
    status: '',
    examResult: '',
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.perPage),

    /** Client-side filtered list based on all filter criteria */
    filteredCandidates(state) {
      const all = state.allCandidates
      const q = state.search.toLowerCase()
      return all.filter((c) => {
        const matchSearch =
          !q ||
          c.fullName.toLowerCase().includes(q) ||
          c.fullName_KH.toLowerCase().includes(q) ||
          c.candidate_no.toLowerCase().includes(q)
        const matchProvince = !state.province_id || c.province_id === state.province_id
        const matchNgo = !state.ngo_id || c.ngo_id === state.ngo_id
        const matchStatus = !state.status || c.status === state.status
        const matchExamResult = !state.examResult || c.exam_result === state.examResult
        return matchSearch && matchProvince && matchNgo && matchStatus && matchExamResult
      })
    },
  },

  actions: {
    /**
     * Fetch campaigns and populate the campaign name cache for NGO display
     */
    async loadCampaignNames() {
      // Skip if already cached to avoid redundant API calls
      if (hasCampaignCache()) return
      try {
        const campaigns = await fetchCampaigns()
        const cache: Record<number, string> = {}
        campaigns.forEach((c) => {
          cache[c.id] = c.name
        })
        setCampaignNameCache(cache)
      } catch {
        // Campaign names are optional; silently fail
      }
    },

    async loadProvinceNames() {
      // Skip if already cached
      if (hasProvinceCache()) return
      try {
        const provinces = await fetchProvinces()
        const cache: Record<number, string> = {}
        provinces.forEach((p) => {
          cache[p.id] = p.name
        })
        setProvinceNameCache(cache)
      } catch {
        // Province names are optional; silently fail
      }
    },

    async loadNgoNames() {
      // Skip if already cached
      if (hasNgoCache()) return
      try {
        const partners = await fetchPartners()
        const cache: Record<number, string> = {}
        if (Array.isArray(partners)) {
          partners.forEach((p) => {
            cache[p.id] = p.name
          })
        }
        setNgoNameCache(cache)
      } catch {
        // NGO names are optional; silently fail
      }
    },

    /**
     * Apply client-side filters and paginate
     */
    applyFilters() {
      const filtered = this.filteredCandidates
      this.total = filtered.length
      const start = (this.page - 1) * this.perPage
      this.candidates = filtered.slice(start, start + this.perPage)
    },

    async fetchCandidates() {
      this.loading = true
      this.error = null
      try {
        // Load all lookup data in parallel (first load only)
        await Promise.all([
          this.loadCampaignNames(),
          this.loadProvinceNames(),
          this.loadNgoNames(),
        ])

        // Fetch all candidates (large per_page to get everything)
        const { candidates: apiCandidates } = await candidateService.fetchCandidates({ per_page: 10000 })

        this.allCandidates = apiCandidates.map(apiCandidateToFrontend)
        this.applyFilters()
      } catch (err) {
        this.error = getErrorMessage(err, 'Failed to load candidates')
      } finally {
        this.loading = false
      }
    },

    setPage(page: number) {
      this.page = page
      this.applyFilters()
    },

    async addCandidate(payload: {
      firstName: string
      lastName: string
      firstNameKH: string
      lastNameKH: string
      gender: 'Male' | 'Female'
      dateOfBirth: string
      phone: string
      schoolName: string
      province_id: number
      campaign_id: number | null
      ngo_id: number | null
      status: string
    }) {
      this.saving = true
      this.error = null
      try {
        const apiPayload = frontendFormToApiPayload(payload)
        await candidateService.createCandidate(apiPayload)
        await this.fetchCandidates()
      } catch (err) {
        this.error = getErrorMessage(err, 'Failed to create candidate')
        throw err
      } finally {
        this.saving = false
      }
    },

    async updateCandidateStatus(id: number, newStatus: string) {
      this.error = null
      try {
        await candidateService.updateCandidateStatus(id, newStatus)
        // Update in allCandidates too
        const idx = this.allCandidates.findIndex(c => c.id === id)
        if (idx !== -1) {
          this.allCandidates[idx].status = newStatus
        }
        this.applyFilters()
      } catch (err) {
        this.error = getErrorMessage(err, 'Failed to update candidate status')
        await this.fetchCandidates()
      }
    },

    async importCandidates(newCandidates: Candidate[]) {
      this.saving = true
      this.error = null
      try {
        for (const candidate of newCandidates) {
          const { firstName, lastName } = splitFullName(candidate.fullName)
          await candidateService.createCandidate({
            first_name: firstName,
            last_name: lastName,
            first_name_kh: candidate.fullName_KH || null,
            gender: candidate.gender,
            dob: candidate.dateOfBirth,
            phone: candidate.phone || null,
            school_name: candidate.schoolName || null,
            campaign_id: candidate.campaign_id ?? null,
            ngo_id: candidate.ngo_id ?? null,
            province_id: candidate.province_id || 1,
          })
        }
        await this.fetchCandidates()
      } catch (err) {
        this.error = getErrorMessage(err, 'Failed to import candidates')
        throw err
      } finally {
        this.saving = false
      }
    },
  },
})
