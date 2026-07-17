import { defineStore } from 'pinia'
import { fetchAssignedVisits } from '../service/service'
import type { VisitStatus } from '../types/visit'

interface State {
  statusByCandidate: Record<string, VisitStatus>
  loaded: boolean
}

export const useInvestigationStore = defineStore('investigation', {
  state: (): State => ({
    statusByCandidate: {},
    loaded: false,
  }),

  getters: {
    statusOf: (state) => (candidateId: string): VisitStatus | undefined => state.statusByCandidate[candidateId],
  },

  actions: {
    async load() {
      if (this.loaded) return
      const visits = await fetchAssignedVisits()
      this.statusByCandidate = Object.fromEntries(visits.map((v) => [v.candidateId, v.status]))
      this.loaded = true
    },

    setStatus(candidateId: string, status: VisitStatus) {
      this.statusByCandidate[candidateId] = status
    },
  },
})