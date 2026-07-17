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
    perPage: 50,
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
      this.loading = true
      this.error = null
      try {
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

        this.candidates = apiCandidates.map(apiCandidateToFrontend)
        this.total = meta?.total ?? apiCandidates.length
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
