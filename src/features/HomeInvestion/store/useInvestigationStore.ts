import { defineStore } from 'pinia'
import { fetchCandidates } from '../service/service'
import type { HStatus } from '../types/visit'

interface State {
  statusByCandidate: Record<string, HStatus>
  loaded: boolean
}

export const useInvestigationStore = defineStore('investigation', {
  state: (): State => ({
    statusByCandidate: {},
    loaded: false,
  }),

  getters: {
    statusOf: (state) => (candidateId: string): HStatus | undefined => state.statusByCandidate[candidateId],
  },

  actions: {
    async load() {
      if (this.loaded) return
      const candidates = await fetchCandidates({ search: '', campaign: '', investigator: '', status: '', dateFrom: '', dateTo: '' })
      this.statusByCandidate = Object.fromEntries(candidates.map((c) => [c.candidateId, c.status]))
      this.loaded = true
    },

    setStatus(candidateId: string, status: HStatus) {
      this.statusByCandidate[candidateId] = status
    },
  },
})
