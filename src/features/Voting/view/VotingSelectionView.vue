<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ShortlistPanel from '../components/ShortlistPanel.vue'
import ConsolidatedProfileCard from '../components/ConsolidatedProfileCard.vue'
import CandidateStoryNotes from '../components/CandidateStoryNotes.vue'
import VoteActions from '../components/VoteActions.vue'
import TallyPanel from '../components/TallyPanel.vue'
import LockRoundDialog from '../components/LockRoundDialog.vue'
import { useVotingStore } from '../store/useVotingStore'
import { fetchConsolidatedProfile, fetchPageMeta, fetchShortlist } from '../service/service'
import type { ConsolidatedProfile, PageMeta, ShortlistCandidate } from '../types/candidate'
import type { VoteChoice } from '../types/vote'

const CACHE_KEY = 'pnc_voting_data'

interface VotingCache {
  meta: PageMeta
  shortlist: ShortlistCandidate[]
  selectedId: string | null
  profile: ConsolidatedProfile
}

function loadCache(): VotingCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as VotingCache) : null
  } catch {
    return null
  }
}

function saveCache(data: VotingCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // silently ignore
  }
}

const cached = loadCache()

const store = useVotingStore()

const meta = ref<PageMeta>(
  cached?.meta ?? { breadcrumb: [], title: 'Voting', roles: [], reqRange: ['', ''] },
)
const shortlist = ref<ShortlistCandidate[]>(cached?.shortlist ?? [])
const selectedId = ref<string | null>(cached?.selectedId ?? null)
const profile = ref<ConsolidatedProfile>(
  cached?.profile ?? {
    candidateId: '',
    candidateName: '',
    examScore: 0,
    examRank: 0,
    assessmentPercent: 0,
    investigationRecommendation: 'Recommended',
    needIndex: 'Low',
    storyNotes: '',
  },
)
const comment = ref('')
const isLockDialogOpen = ref(false)

// Kick off store data loading early from cache
if (cached?.selectedId) {
  store.loadCandidate(cached.selectedId)
}

const votedIds = computed(() => new Set(Object.keys(store.myVoteByCandidate)))
const currentTally = computed(() => (selectedId.value ? store.tallyOf(selectedId.value) : { approve: 0, reject: 0, abstain: 0 }))
const currentOutcome = computed(() => (selectedId.value ? store.outcomeOf(selectedId.value) : 'Pending'))
const currentVote = computed(() => (selectedId.value ? store.myVoteOf(selectedId.value) : undefined))

async function selectCandidate(candidate: ShortlistCandidate) {
  selectedId.value = candidate.id
  comment.value = ''
  profile.value = await fetchConsolidatedProfile(candidate.id)
  await store.loadCandidate(candidate.id)
  saveCache({
    meta: meta.value,
    shortlist: shortlist.value,
    selectedId: selectedId.value,
    profile: profile.value,
  })
}

async function handleVote(choice: VoteChoice) {
  if (!selectedId.value) return
  await store.vote(selectedId.value, choice, comment.value)
}

async function handleConfirmLock() {
  await store.lockRound()
  isLockDialogOpen.value = false
}

function handleViewFinalList() {
  // Hook up to router navigation, e.g. router.push({ name: 'final-list-waitlist' })
}

onMounted(async () => {
  const [metaData, shortlistData] = await Promise.all([
    fetchPageMeta('Round 1'),
    fetchShortlist(),
  ])
  meta.value = metaData
  shortlist.value = shortlistData

  if (shortlistData.length > 0) {
    const [profileData] = await Promise.all([
      fetchConsolidatedProfile(shortlistData[0].id),
      store.loadCandidate(shortlistData[0].id),
    ])
    selectedId.value = shortlistData[0].id
    profile.value = profileData
  }

  saveCache({
    meta: meta.value,
    shortlist: shortlist.value,
    selectedId: selectedId.value,
    profile: profile.value,
  })
})
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-7xl space-y-4">
      <PageHeader :meta="meta" />

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_240px]">
          <ShortlistPanel
            :candidates="shortlist"
            :selected-id="selectedId"
            :voted-ids="votedIds"
            @select="selectCandidate"
          />

          <div class="rounded border border-slate-200 bg-white">
            <ConsolidatedProfileCard :profile="profile" :req-tag="meta?.reqRange[0]" />
            <CandidateStoryNotes :notes="profile.storyNotes" />
            <VoteActions
              :selected="currentVote"
              v-model:comment="comment"
              :disabled="store.isLocked"
              @vote="handleVote"
            />
          </div>

          <TallyPanel
            :tally="currentTally"
            :outcome="currentOutcome"
            :is-locked="store.isLocked"
            @lock-round="isLockDialogOpen = true"
            @view-final-list="handleViewFinalList"
          />
      </div>
    </div>

    <LockRoundDialog v-model:open="isLockDialogOpen" round-label="Round 1" @confirm="handleConfirmLock" />
  </div>
</template>
