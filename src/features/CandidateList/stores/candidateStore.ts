import { defineStore } from 'pinia'
import type { Candidate } from '../types/candidate'

const mockCandidates: Candidate[] = [
  { id: 1, candidate_no: 'C-001', name: 'Sok Dara', province: 'Phnom Penh', ngo: 'NGO A', exam_score: 85, exam_result: 'Pass', status: 'Assessed' },
  { id: 2, candidate_no: 'C-002', name: 'Chan Bopha', province: 'Siem Reap', ngo: 'NGO B', exam_score: 45, exam_result: 'Fail', status: 'Exam Done' },
  { id: 3, candidate_no: 'C-003', name: 'Pich Sophea', province: 'Battambang', ngo: 'NGO A', exam_score: null, exam_result: null, status: 'Investigating' },
  { id: 4, candidate_no: 'C-004', name: 'Rin Makara', province: 'Kampong Cham', ngo: 'NGO C', exam_score: 72, exam_result: 'Pass', status: 'Assessed' },
  { id: 5, candidate_no: 'C-005', name: 'Vuth Sreyleak', province: 'Phnom Penh', ngo: 'NGO B', exam_score: 60, exam_result: 'Pass', status: 'Exam Done' },
  { id: 6, candidate_no: 'C-006', name: 'Heng Vibol', province: 'Siem Reap', ngo: 'NGO A', exam_score: 38, exam_result: 'Fail', status: 'Exam Done' },
  { id: 7, candidate_no: 'C-007', name: 'Lim Chanthy', province: 'Battambang', ngo: 'NGO C', exam_score: null, exam_result: null, status: 'Investigating' },
  { id: 8, candidate_no: 'C-008', name: 'Noun Piseth', province: 'Phnom Penh', ngo: 'NGO A', exam_score: 91, exam_result: 'Pass', status: 'Assessed' },
]

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    loading: false,
    candidates: [] as Candidate[],
    page: 1,
    perPage: 5,
    total: 0,
    search: '',
    province: '',
    ngo: '',
    status: '',
    examResult: '',
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.perPage),

    filteredCandidates: (state) => {
      return mockCandidates.filter((c) => {
        const q = state.search.toLowerCase()
        const matchSearch = !q || c.name.toLowerCase().includes(q) || c.candidate_no.toLowerCase().includes(q)
        const matchProvince = !state.province || c.province === state.province
        const matchNgo = !state.ngo || c.ngo === state.ngo
        const matchStatus = !state.status || c.status === state.status
        const matchExam = !state.examResult || c.exam_result === state.examResult
        return matchSearch && matchProvince && matchNgo && matchStatus && matchExam
      })
    },
  },

  actions: {
    fetchCandidates() {
      this.loading = true
      setTimeout(() => {
        const filtered = this.filteredCandidates
        this.total = filtered.length
        const start = (this.page - 1) * this.perPage
        this.candidates = filtered.slice(start, start + this.perPage)
        this.loading = false
      }, 300)
    },

    setPage(page: number) {
      this.page = page
      this.fetchCandidates()
    },
  },
})
