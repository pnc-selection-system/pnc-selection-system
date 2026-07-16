import type { ConsolidatedProfile, PageMeta, ShortlistCandidate } from '../types/candidate'
import type { Outcome, Tally, VoteChoice } from '../types/vote'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const shortlist: ShortlistCandidate[] = [
  { id: 'c1', name: 'Sokha N.', votesCast: 5, totalVoters: 7 },
  { id: 'c2', name: 'Dara K.', votesCast: 7, totalVoters: 7 },
  { id: 'c3', name: 'Rithy S.', votesCast: 3, totalVoters: 7 },
]

const profiles: Record<string, ConsolidatedProfile> = {
  c1: {
    candidateId: 'c1',
    candidateName: 'Sokha N.',
    examScore: 71.5,
    examRank: 142,
    assessmentPercent: 81,
    investigationRecommendation: 'Recommended',
    needIndex: 'High',
    storyNotes:
      'Sokha grew up in a farming household and would be the first in the family to finish upper secondary school. The home visit noted strong family support but limited study space and unreliable electricity.',
  },
  c2: {
    candidateId: 'c2',
    candidateName: 'Dara K.',
    examScore: 84.2,
    examRank: 38,
    assessmentPercent: 90,
    investigationRecommendation: 'Recommended',
    needIndex: 'Medium',
    storyNotes: 'Consistently top of class; interested in a teaching career. Investigation found stable home environment.',
  },
  c3: {
    candidateId: 'c3',
    candidateName: 'Rithy S.',
    examScore: 66.0,
    examRank: 210,
    assessmentPercent: 58,
    investigationRecommendation: 'Not recommended',
    needIndex: 'Low',
    storyNotes: 'Assessment noted low commitment score. Investigation still pending full sign-off from committee.',
  },
}

const tallies: Record<string, Tally> = {
  c1: { approve: 5, reject: 1, abstain: 1 },
  c2: { approve: 7, reject: 0, abstain: 0 },
  c3: { approve: 2, reject: 1, abstain: 0 },
}

const outcomes: Record<string, Outcome> = {
  c1: 'Selected',
  c2: 'Selected',
  c3: 'Pending',
}

export async function fetchPageMeta(roundLabel: string): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Decision', 'Voting & Selection'],
    title: `Voting · ${roundLabel}`,
    roles: ['Committee members', 'Manager'],
    reqRange: ['FR-VT-1', 'FR-VT-8'],
  })
}

export async function fetchShortlist(): Promise<ShortlistCandidate[]> {
  return wait(shortlist)
}

export async function fetchConsolidatedProfile(candidateId: string): Promise<ConsolidatedProfile> {
  return wait(profiles[candidateId]!)
}

export async function fetchTally(candidateId: string): Promise<Tally> {
  return wait(tallies[candidateId] ?? { approve: 0, reject: 0, abstain: 0 })
}

export async function fetchOutcome(candidateId: string): Promise<Outcome> {
  return wait(outcomes[candidateId] ?? 'Pending')
}

export async function castVote(candidateId: string, choice: VoteChoice, comment: string): Promise<Tally> {
  const current = tallies[candidateId] ?? { approve: 0, reject: 0, abstain: 0 }
  const key = choice.toLowerCase() as keyof Tally
  tallies[candidateId] = { ...current, [key]: current[key] + 1 }
  return wait(tallies[candidateId]!)
}

export async function lockRound(): Promise<void> {
  await wait(undefined)
}