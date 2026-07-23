import { defineStore } from 'pinia'
import type { Candidate } from '../types/candidate'
import { apiCandidateToFrontend, frontendFormToApiPayload, hasCampaignCache, hasNgoCache, hasProvinceCache, setCampaignNameCache, setNgoNameCache, setProvinceNameCache, splitFullName } from '../utils/mapper'
import * as candidateService from '../services/candidateService'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { fetchProvinces } from '../services/provinceService'
import { fetchPartners } from '@/features/ngosPartner/service/service'
import { getErrorMessage } from '@/utils/error'
import { ref, shallowRef } from 'vue'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    loading: false,
    saving: false,
    error: null as string | null,
    candidates: shallowRef<Candidate[]>([]),
    total: 0,
    page: 1,
    perPage: Number(localStorage.getItem('candidate_perPage') || '10'),
    search: '',
    province_id: null as number | null,
    ngo_id: null as number | null,
    status: '',
    examResult: '',
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.perPage),
  },

  actions: {
    hydrateFromStorage() {
      try {
        const raw = sessionStorage.getItem('candidates')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && Array.isArray(parsed.candidates)) {
            this.candidates = parsed.candidates
            this.total = parsed.total ?? 0
          }
        }
      } catch {}
    },

    async loadCampaignNames() {
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

    async applyFilters() {
      this.page = 1
      await this.fetchCandidates()
    },

    async fetchCandidates() {
      // Skip API call if we already have data (hydrated from sessionStorage on refresh)
      if (this.candidates.length > 0) {
        return
      }

      this.loading = true
      this.error = null
      try {
        // Name caches may already be populated by route pre-fetch — skip if so
        await Promise.all([
          this.loadCampaignNames(),
          this.loadProvinceNames(),
          this.loadNgoNames(),
        ])

        const { candidates: apiCandidates, meta } = await candidateService.fetchCandidates({
          page: this.page,
          per_page: this.perPage,
          search: this.search || undefined,
          province_id: this.province_id ?? undefined,
          ngo_id: this.ngo_id ?? undefined,
          status: this.status || undefined,
          exam_result: this.examResult || undefined,
        })

        const mapped = apiCandidates.map(apiCandidateToFrontend)

        // Detect if the backend is NOT paginating (returns all records).
        // If so, fall back to client-side pagination by slicing the data set.
        if (mapped.length > this.perPage) {
          const start = (this.page - 1) * this.perPage
          this.candidates = mapped.slice(start, start + this.perPage)
          this.total = mapped.length
        } else {
          // Backend is paginating — use the server response directly
          this.candidates = mapped
          this.total = meta?.total ?? mapped.length
        }

        // Persist to sessionStorage for instant loading on refresh / revisit
        try {
          sessionStorage.setItem('candidates', JSON.stringify({
            candidates: this.candidates,
            total: this.total,
          }))
        } catch {}
      } catch (err) {
        this.error = getErrorMessage(err, 'Failed to load candidates')
      } finally {
        this.loading = false
      }
    },

    setPage(page: number) {
      this.page = page
      this.fetchCandidates()
    },

    setPerPage(perPage: number) {
      localStorage.setItem('candidate_perPage', String(perPage))
      this.perPage = perPage
      this.page = 1
      this.fetchCandidates()
    },

    async addCandidate(payload: {
      firstName: string
      lastName: string
      firstNameKH: string
      lastNameKH: string
      gender: 'Male' | 'Female'
      dateOfBirth: string
      phone: string
      province_id: number
      schoolName: string
      campaign_id: number | null
      ngo_id: number | null
      status: string
    }) {
      this.saving = true
      this.error = null
      try {
        // Check for duplicate by phone + full name
        if (payload.phone) {
          const existing = await candidateService.checkDuplicateCandidate(payload.phone)
          const fullName = `${payload.firstName} ${payload.lastName}`.toLowerCase().trim()
          const isDuplicate = existing.some((c) => {
            const existingName = `${c.first_name} ${c.last_name}`.toLowerCase().trim()
            return existingName === fullName
          })
          if (isDuplicate) {
            this.error = 'A candidate with this name and phone number already exists.'
            throw new Error('Duplicate candidate')
          }
        }

        const apiPayload = frontendFormToApiPayload(payload)
        await candidateService.createCandidate(apiPayload)
        await this.fetchCandidates()
      } catch (err) {
        if (!this.error) {
          this.error = getErrorMessage(err, 'Failed to create candidate')
        }
        throw err
      } finally {
        this.saving = false
      }
    },

    async updateCandidateStatus(id: number, newStatus: string) {
      this.error = null
      try {
        await candidateService.updateCandidateStatus(id, newStatus)
        const idx = this.candidates.findIndex(c => c.id === id)
        if (idx !== -1) {
          this.candidates = this.candidates.map(c =>
            c.id === id ? { ...c, status: newStatus } : c
          )
        }
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
