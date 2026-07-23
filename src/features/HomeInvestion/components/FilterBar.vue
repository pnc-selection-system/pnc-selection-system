9<script setup lang="ts">
import type { InvestigationFilters, InvestigationStatus } from '../types/investigation'

defineProps<{
  filters: InvestigationFilters
  campaigns: string[]
  investigators: { id: string; name: string }[]
  statuses: InvestigationStatus[]
}>()

const emit = defineEmits<{
  'update:filters': [filters: InvestigationFilters]
  search: []
  reset: []
}>()

function updateFilter<K extends keyof InvestigationFilters>(key: K, value: InvestigationFilters[K]) {
  emit('update:filters', { ...props.filters, [key]: value })
}

function handleSearch() {
  emit('search')
}

function handleReset() {
  emit('reset')
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div class="lg:col-span-2">
        <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Search Candidate
        </label>
        <input
          type="text"
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Search by name, campaign, or investigator..."
          :value="filters.search"
          @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div>
        <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Campaign
        </label>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="filters.campaign"
          @change="updateFilter('campaign', ($event.target as HTMLSelectElement).value || undefined)"
        >
          <option value="">All Campaigns</option>
          <option v-for="campaign in campaigns" :key="campaign" :value="campaign">
            {{ campaign }}
          </option>
        </select>
      </div>

      <div>
        <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Investigator
        </label>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="filters.investigatorId"
          @change="updateFilter('investigatorId', ($event.target as HTMLSelectElement).value || undefined)"
        >
          <option value="">All Investigators</option>
          <option v-for="investigator in investigators" :key="investigator.id" :value="investigator.id">
            {{ investigator.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Status
        </label>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="filters.status"
          @change="updateFilter('status', ($event.target as HTMLSelectElement).value as InvestigationStatus | undefined)"
        >
          <option value="">All Statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
      <div class="flex flex-1 items-center gap-2">
        <div>
          <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
            From
          </label>
          <input
            type="date"
            class="mt-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            :value="filters.dateFrom"
            @input="updateFilter('dateFrom', ($event.target as HTMLInputElement).value || undefined)"
          />
        </div>
        <div>
          <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
            To
          </label>
          <input
            type="date"
            class="mt-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            :value="filters.dateTo"
            @input="updateFilter('dateTo', ($event.target as HTMLInputElement).value || undefined)"
          />
        </div>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          @click="handleReset"
        >
          Reset
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          @click="handleSearch"
        >
          Search
        </button>
      </div>
    </div>
  </div>
</template>