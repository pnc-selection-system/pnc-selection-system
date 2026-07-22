<template>
  <BaseModal
    :model-value="modelValue"
    title="Candidate Profile"
    width="780px"
    top="5vh"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="candidate" class="space-y-0">
      <!-- Header Section -->
      <div class="flex items-start gap-5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5">
        <div class="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-white">
          <span class="text-2xl font-bold text-blue-600">{{ (candidate.fullName || '?').charAt(0).toUpperCase() }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3">
            <h3 class="truncate text-lg font-semibold text-slate-900">{{ candidate.fullName }}</h3>
            <span v-if="candidate.fullName_KH" class="truncate text-sm text-slate-500">({{ candidate.fullName_KH }})</span>
          </div>
          <div class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {{ candidate.gender }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ candidate.dateOfBirth }}
            </span>
            <span v-if="candidate.phone" class="inline-flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {{ candidate.phone }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {{ candidate.province }}
            </span>
          </div>
        </div>
        <div class="flex-shrink-0">
          <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" :class="statusBadgeClass(candidate.status)">{{ candidate.status }}</span>
        </div>
      </div>

      <div class="mt-5">
        <div class="border-b border-slate-200">
          <nav class="-mb-px flex gap-6">
            <button v-for="tab in tabs" :key="tab.key" :class="['relative pb-3 text-sm font-medium transition-colors', activeTab === tab.key ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700']" @click="activeTab = tab.key">
              {{ tab.label }}
              <div v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            </button>
          </nav>
        </div>

        <div class="py-5">
          <div v-if="activeTab === 'personal'" class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Student ID</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.student_id || '---' }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Full Name (EN)</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.fullName }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Full Name (KH)</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.fullName_KH || '---' }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Gender</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.gender }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Date of Birth</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.dateOfBirth }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Phone</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.phone || '---' }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Province</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.province }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">School</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.schoolName || '---' }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">NGO</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.ngo || '---' }}</p></div>
            <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Status</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.status }}</p></div>
          </div>

          <div v-if="activeTab === 'exam'">
            <div v-if="candidate.exam_score !== null || candidate.exam_result" class="grid grid-cols-2 gap-x-8 gap-y-4">
              <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Exam Score</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.exam_score !== null ? candidate.exam_score : '---' }}</p></div>
              <div><p class="text-xs font-medium uppercase tracking-wider text-slate-400">Exam Result</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.exam_result || '---' }}</p></div>
            </div>
            <div v-else class="flex flex-col items-center gap-2 py-8 text-slate-400">
              <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p class="text-sm font-medium">No exam data available</p>
              <p class="text-xs text-slate-400">This candidate has not taken any exams yet.</p>
            </div>
          </div>

          <div v-if="activeTab === 'organization'" class="space-y-5">
            <div><h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">School Information</h4><div class="rounded-lg bg-slate-50 p-4"><p class="text-xs font-medium uppercase tracking-wider text-slate-400">School Name</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.schoolName || '---' }}</p></div></div>
            <div><h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">NGO Information</h4><div class="rounded-lg bg-slate-50 p-4"><p class="text-xs font-medium uppercase tracking-wider text-slate-400">NGO Name</p><p class="mt-1 text-sm font-medium text-slate-900">{{ candidate.ngo || '---' }}</p></div></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-3 py-12 text-slate-400">
      <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      <p class="text-sm font-medium">No candidate selected</p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" size="small" @click="$emit('update:modelValue', false)">Close</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Candidate } from '../types/candidate'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  modelValue: boolean
  candidate: Candidate | null
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const activeTab = ref('personal')

const tabs = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'exam', label: 'Exam' },
  { key: 'organization', label: 'School & NGO' },
]

watch(() => props.candidate, () => { activeTab.value = 'personal' })

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    'Registered': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    'Exam Done': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    'Investigating': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    'Assessed': 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20',
    'Approved': 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    'Rejected': 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
    'On Hold': 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20',
  }
  return map[status] || 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20'
}
</script>

<style scoped>
.el-dialog__body { padding: 0 !important; }
</style>
