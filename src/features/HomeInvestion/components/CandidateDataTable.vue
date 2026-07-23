<script setup lang="ts">
import { ref } from 'vue'
import StatusBadge from './StatusBadge.vue'
import EmptyState from './EmptyState.vue'
import type { Candidate, CandidateFilters, HStatus } from '../types/visit'

const props = defineProps<{
  candidates: Candidate[]
  selectedCandidateId: string | null
  loading?: boolean
  campaigns: string[]
  investigators: string[]
  statuses: string[]
}>()

const emit = defineEmits<{
  select: [candidate: Candidate]
  'update:filters': [filters: CandidateFilters]
}>()

const filters = ref<CandidateFilters>({
  search: '',
  campaign: '',
  investigator: '',
  status: '',
  dateFrom: '',
  dateTo: '',
})

const localSearch = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput(value: string) {
  localSearch.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    filters.value.search = value
    emit('update:filters', { ...filters.value })
  }, 300)
}

function updateFilter<K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) {
  filters.value[key] = value
  emit('update:filters', { ...filters.value })
}

function resetFilters() {
  filters.value = { search: '', campaign: '', investigator: '', status: '', dateFrom: '', dateTo: '' }
  localSearch.value = ''
  emit('update:filters', { ...filters.value })
}

const statusActions: Record<HStatus, string> = {
  Assigned: 'View',
  'In Progress': 'Continue',
  Submitted: 'View',
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
    <!-- Header -->
    <div class="border-b border-slate-100 px-5 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Candidate List</h2>
          <p class="mt-0.5 text-xs text-slate-500">
            <span class="font-medium text-slate-700">{{ candidates.length }}</span> candidate{{ candidates.length !== 1 ? 's' : '' }} pending investigation
          </p>
        </div>
        <svg class="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="border-b border-slate-100 px-5 py-4">
      <div class="relative">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          placeholder="Search by ID or Name..."
          :value="localSearch"
          @input="onSearchInput(($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2.5">
        <div>
          <label class="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Campaign</label>
          <select
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            :value="filters.campaign"
            @change="updateFilter('campaign', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Campaigns</option>
            <option v-for="c in campaigns" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Investigator</label>
          <select
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            :value="filters.investigator"
            @change="updateFilter('investigator', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Investigators</option>
            <option v-for="i in investigators" :key="i" :value="i">{{ i }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</label>
          <select
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            :value="filters.status"
            @change="updateFilter('status', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">All Statuses</option>
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</label>
          <input
            type="date"
            class="w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
            :value="filters.dateFrom"
            @input="updateFilter('dateFrom', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <button
        type="button"
        class="mt-2.5 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600"
        @click="resetFilters"
      >
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Clear all filters
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-slate-100">
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Candidate ID</th>
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Name</th>
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Campaign</th>
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Investigator</th>
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Visit Date</th>
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Status</th>
            <th class="sticky top-0 bg-slate-50/90 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 backdrop-blur-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="candidate in candidates"
            :key="candidate.candidateId"
            class="cursor-pointer border-b border-slate-50 transition-all duration-150 hover:bg-blue-50/40"
            :class="{
              'bg-blue-50/60 shadow-[inset_0_0_0_2px_rgba(59,130,246,0.15)]': candidate.candidateId === selectedCandidateId,
              'hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]': candidate.candidateId !== selectedCandidateId,
            }"
            @click="emit('select', candidate)"
          >
            <td class="px-4 py-3">
              <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700">{{ candidate.candidateId }}</span>
            </td>
            <td class="px-4 py-3 text-sm font-semibold text-slate-800">{{ candidate.candidateName }}</td>
            <td class="px-4 py-3 text-xs text-slate-500">{{ candidate.campaign }}</td>
            <td class="px-4 py-3 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1">
                <svg class="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ candidate.assignedInvestigator }}
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1">
                <svg class="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ candidate.visitDate }}
              </span>
            </td>
            <td class="px-4 py-3">
              <StatusBadge :status="candidate.status" />
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-all duration-150 hover:bg-blue-100"
              >
                {{ statusActions[candidate.status] }}
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </td>
          </tr>
          <tr v-if="!candidates.length">
            <td colspan="7" class="px-4 py-12">
              <EmptyState
                title="No candidates found"
                description="Try adjusting your search or filter criteria"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="flex items-center justify-center border-t border-slate-100 bg-slate-50/50 px-5 py-4"
    >
      <div class="flex items-center gap-2.5 text-xs text-slate-500">
        <svg class="h-4 w-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading candidates...
      </div>
    </div>
  </div>
</template>
