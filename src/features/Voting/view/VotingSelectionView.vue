<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import ShortlistPanel from '../components/ShortlistPanel.vue'
import ConsolidatedProfileCard from '../components/ConsolidatedProfileCard.vue'
import CandidateStoryNotes from '../components/CandidateStoryNotes.vue'
import VoteActions from '../components/VoteActions.vue'
import TallyPanel from '../components/TallyPanel.vue'
import LockRoundDialog from '../components/LockRoundDialog.vue'
import VotingSkeleton from '../components/VotingSkeleton.vue'
import { useVotingStore } from '../store/useVotingStore'
import { fetchConsolidatedProfile, fetchPageMeta, fetchShortlist } from '../service/service'
import type { ConsolidatedProfile, PageMeta, ShortlistCandidate } from '../types/candidate'
import type { VoteChoice } from '../types/vote'

const store = useVotingStore()

const loading = ref(true)
const meta = ref<PageMeta | null>(null)
const shortlist = ref<ShortlistCandidate[]>([])
const selectedId = ref<string | null>(null)
const profile = ref<ConsolidatedProfile | null>(null)
const comment = ref('')
const isLockDialogOpen = ref(false)

const votedIds = computed(() => new Set(Object.keys(store.myVoteByCandidate)))
const currentTally = computed(() => (selectedId.value ? store.tallyOf(selectedId.value) : { approve: 0, reject: 0, abstain: 0 }))
const currentOutcome = computed(() => (selectedId.value ? store.outcomeOf(selectedId.value) : 'Pending'))
const currentVote = computed(() => (selectedId.value ? store.myVoteOf(selectedId.value) : undefined))

async function selectCandidate(candidate: ShortlistCandidate) {
  selectedId.value = candidate.id
  comment.value = ''
  profile.value = await fetchConsolidatedProfile(candidate.id)
  await store.loadCandidate(candidate.id)
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
  console.log('view final list & waitlist')
}

onMounted(async () => {
  meta.value = await fetchPageMeta('Round 1')
  shortlist.value = await fetchShortlist()
  loading.value = false
  if (shortlist.value.length > 0) await selectCandidate(shortlist.value[0]!)
})
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-7xl space-y-4">
      <PageHeader v-if="meta" :meta="meta" />

      <VotingSkeleton v-if="loading" />

      <template v-else>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_240px]">
          <ShortlistPanel
            :candidates="shortlist"
            :selected-id="selectedId"
            :voted-ids="votedIds"
            @select="selectCandidate"
          />

          <div v-if="profile" class="rounded border border-slate-200 bg-white">
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

      </template>
    </div>

    <LockRoundDialog v-model:open="isLockDialogOpen" round-label="Round 1" @confirm="handleConfirmLock" />
  </div>
</template>