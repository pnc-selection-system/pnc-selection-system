<script setup lang="ts">
import type { CandidateStatus } from '../types/index'
import BaseSelect from '@/components/base/BaseSelect.vue'

defineProps<{
  provinceFilter: string
  ngoFilter: string
  statusFilter: CandidateStatus | 'all'
  examResultFilter: string
  showDuplicatesOnly: boolean
  provinces: string[]
  ngos: string[]
}>()

const emit = defineEmits<{
  (e: 'update:provinceFilter', value: string): void
  (e: 'update:ngoFilter', value: string): void
  (e: 'update:statusFilter', value: CandidateStatus | 'all'): void
  (e: 'update:examResultFilter', value: string): void
  (e: 'update:showDuplicatesOnly', value: boolean): void
  (e: 'apply'): void
}>()
</script>

<template>
  <div class="w-[240px] flex-shrink-0 rounded-lg border border-slate-200 bg-white p-5">
    <h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">FILTERS</h3>

    <div class="space-y-4">
      <!-- Province -->
      <div>
        <label class="mb-1.5 block text-[0.65rem] font-medium uppercase text-slate-500">PROVINCE</label>
        <BaseSelect
          :model-value="provinceFilter"
          :options="[
            { value: 'all', label: 'All' },
            ...provinces.map(p => ({ value: p, label: p })),
          ]"
          @update:model-value="emit('update:provinceFilter', $event as string)"
        />
      </div>

      <!-- NGO -->
      <div>
        <label class="mb-1.5 block text-[0.65rem] font-medium uppercase text-slate-500">NGO</label>
        <BaseSelect
          :model-value="ngoFilter"
          :options="[
            { value: 'all', label: 'All' },
            ...ngos.map(n => ({ value: n, label: n })),
          ]"
          @update:model-value="emit('update:ngoFilter', $event as string)"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="mb-1.5 block text-[0.65rem] font-medium uppercase text-slate-500">STATUS</label>
        <BaseSelect
          :model-value="statusFilter"
          :options="[
            { value: 'all', label: 'All' },
            { value: 'registered', label: 'Registered' },
            { value: 'exam_done', label: 'Exam done' },
            { value: 'investigating', label: 'Investigating' },
            { value: 'assessed', label: 'Assessed' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'on_hold', label: 'On Hold' },
          ]"
          @update:model-value="emit('update:statusFilter', $event as CandidateStatus | 'all')"
        />
      </div>

      <!-- Exam Result -->
      <div>
        <label class="mb-1.5 block text-[0.65rem] font-medium uppercase text-slate-500">EXAM RESULT</label>
        <BaseSelect
          :model-value="examResultFilter"
          :options="[
            { value: 'all', label: 'All' },
            { value: 'pass', label: 'Pass' },
            { value: 'fail', label: 'Fail' },
            { value: 'none', label: 'No exam' },
          ]"
          @update:model-value="emit('update:examResultFilter', $event as string)"
        />
      </div>

      <!-- Possible Duplicates -->
      <div class="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          :checked="showDuplicatesOnly"
          class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          @change="emit('update:showDuplicatesOnly', ($event.target as HTMLInputElement).checked)"
        />
        <label class="text-xs text-slate-600">Possible duplicates only</label>
      </div>

      <!-- Apply Button -->
      <button
        class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        @click="emit('apply')"
      >
        Apply filters
      </button>
    </div>
  </div>
</template>
