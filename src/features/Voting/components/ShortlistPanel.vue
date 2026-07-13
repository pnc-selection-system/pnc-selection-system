<script setup lang="ts">
import type { ShortlistCandidate } from '../types/candidate'

defineProps<{
  candidates: ShortlistCandidate[]
  selectedId?: string | null
  votedIds: Set<string>
}>()

const emit = defineEmits<{
  select: [candidate: ShortlistCandidate]
}>()
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white">
    <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Shortlist · {{ candidates.length }}
      </p>
      <span class="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
        Open
      </span>
    </div>

    <div class="divide-y divide-slate-50">
      <button
        v-for="candidate in candidates"
        :key="candidate.id"
        type="button"
        class="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
        :class="{ 'bg-blue-50/50': candidate.id === selectedId }"
        @click="emit('select', candidate)"
      >
        <span>
          <span class="block text-sm font-semibold text-slate-800">{{ candidate.name }}</span>
          <span class="text-sm text-slate-400">
            votes {{ candidate.votesCast }}/{{ candidate.totalVoters }}
            <span v-if="votedIds.has(candidate.id)" class="text-green-600">✓</span>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>