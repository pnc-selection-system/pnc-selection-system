import { defineStore } from 'pinia'
import { getCandidates } from '../services/candidateService'
import type { Candidate } from '../types/candidate'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    loading: false,
    candidates: [] as Candidate[],
    page: 1,
    perPage: 10,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.perPage),
  },

  actions: {
    async fetchCandidates(params?: Record<string, unknown>) {
      this.loading = true
      try {
        const res = await getCandidates({ page: this.page, per_page: this.perPage, ...params })
        this.candidates = res.data.data
        this.total = res.data.total
      } finally {
        this.loading = false
      }
    },

    setPage(page: number) {
      this.page = page
      this.fetchCandidates()
    },
  },
})
