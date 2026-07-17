import { defineStore } from 'pinia'
import { publishAndLockRound } from '../service/service'
import type { PublishStatus } from '../types/results'

interface State {
  currentRoundId: string
  statusByRound: Record<string, PublishStatus>
}

export const useResultsStore = defineStore('results', {
  state: (): State => ({
    currentRoundId: 'r1',
    statusByRound: { r1: 'draft', r2: 'draft' },
  }),

  getters: {
    currentStatus: (state): PublishStatus => state.statusByRound[state.currentRoundId] ?? 'draft',
    isLocked: (state) => (roundId: string) => state.statusByRound[roundId] === 'published',
  },

  actions: {
    setRound(roundId: string) {
      this.currentRoundId = roundId
    },

    async publishAndLock() {
      // Irreversible: once published, downstream ranking/assessment/voting (FR-EX-11)
      // reads from this store instead of refetching results state.
      await publishAndLockRound(this.currentRoundId)
      this.statusByRound[this.currentRoundId] = 'published'
    },
  },
})