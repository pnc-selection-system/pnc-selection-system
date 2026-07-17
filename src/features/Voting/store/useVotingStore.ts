import { defineStore } from 'pinia'
import { castVote, fetchOutcome, fetchTally, lockRound as lockRoundRequest } from '../service/service'
import type { Outcome, Tally, VoteChoice } from '../types/vote'

interface State {
  roundId: string
  isLocked: boolean
  tallyByCandidate: Record<string, Tally>
  myVoteByCandidate: Record<string, VoteChoice>
  outcomeByCandidate: Record<string, Outcome>
}

export const useVotingStore = defineStore('voting', {
  state: (): State => ({
    roundId: 'r1',
    isLocked: false,
    tallyByCandidate: {},
    myVoteByCandidate: {},
    outcomeByCandidate: {},
  }),

  getters: {
    tallyOf: (state) => (candidateId: string): Tally =>
      state.tallyByCandidate[candidateId] ?? { approve: 0, reject: 0, abstain: 0 },
    myVoteOf: (state) => (candidateId: string): VoteChoice | undefined => state.myVoteByCandidate[candidateId],
    outcomeOf: (state) => (candidateId: string): Outcome => state.outcomeByCandidate[candidateId] ?? 'Pending',
  },

  actions: {
    async loadCandidate(candidateId: string) {
      const [tally, outcome] = await Promise.all([fetchTally(candidateId), fetchOutcome(candidateId)])
      this.tallyByCandidate[candidateId] = tally
      this.outcomeByCandidate[candidateId] = outcome
    },

    async vote(candidateId: string, choice: VoteChoice, comment: string) {
      if (this.isLocked) return
      const tally = await castVote(candidateId, choice, comment)
      this.tallyByCandidate[candidateId] = tally
      this.myVoteByCandidate[candidateId] = choice
    },

    async lockRound() {
      // Irreversible: tally becomes final and feeds Reports & Exports (FR-VT-6/8).
      await lockRoundRequest()
      this.isLocked = true
    },
  },
})