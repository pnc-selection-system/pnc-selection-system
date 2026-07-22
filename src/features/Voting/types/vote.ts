export type VoteChoice = 'Approve' | 'Reject' | 'Abstain'

export interface Tally {
  approve: number
  reject: number
  abstain: number
}

export type Outcome = 'Selected' | 'Not selected' | 'Pending'