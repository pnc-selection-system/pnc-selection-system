<script setup lang="ts">
import { computed } from 'vue'
import type { Candidate } from '../types/index'

const props = defineProps<{
  candidate: Candidate
}>()

const ASSESSMENT_THRESHOLD = 70

// Compute exam result info
const examInfo = computed(() => {
  const score = props.candidate?.examScore ?? 0
  const result = props.candidate?.examResult
  const isPass = result === 'pass'
  return {
    score,
    total: 100,
    isPass,
    resultLabel: isPass ? 'Pass' : result === 'fail' ? 'Fail' : 'N/A',
  }
})

// Compute assessment info (interview score as percentage)
const assessmentInfo = computed(() => {
  const score = props.candidate?.interviewScore ?? 0
  const isAbove = score >= ASSESSMENT_THRESHOLD
  return {
    score,
    isAbove,
    label: isAbove ? 'Above threshold' : 'Below threshold',
  }
})

// Compute investigation status
const investigationInfo = computed(() => {
  const status = props.candidate?.status
  const isInvestigating = status === 'investigating'
  const isAssessed = status === 'assessed' || status === 'approved'
  return {
    status,
    isInvestigating,
    isComplete: isAssessed,
    label: isInvestigating ? 'In progress' : isAssessed ? 'Completed' : 'Pending',
    color: isInvestigating ? 'blue' : isAssessed ? 'green' : 'slate',
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- Exam Total Card -->
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Exam Total
        </h4>
        <div class="mb-3">
          <span class="text-3xl font-bold text-slate-900">{{ examInfo.score }}</span>
          <span class="text-lg text-slate-400"> / {{ examInfo.total }}</span>
        </div>
        <div>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
              examInfo.isPass
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700',
            ]"
          >
            {{ examInfo.resultLabel }}
          </span>
        </div>
      </div>

      <!-- Assessment Card -->
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Assessment
        </h4>
        <div class="mb-3">
          <span class="text-3xl font-bold text-slate-900">{{ assessmentInfo.score }}%</span>
        </div>
        <div>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
              assessmentInfo.isAbove
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700',
            ]"
          >
            {{ assessmentInfo.label }}
          </span>
        </div>
      </div>

      <!-- Investigation Card -->
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Investigation
        </h4>
        <div class="mb-3">
          <span v-if="investigationInfo.isComplete" class="text-3xl font-bold text-slate-900">✓</span>
          <span v-else class="text-3xl font-bold text-slate-400">—</span>
        </div>
        <div>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
              investigationInfo.color === 'blue'
                ? 'bg-blue-50 text-blue-700'
                : investigationInfo.color === 'green'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600',
            ]"
          >
            {{ investigationInfo.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Evaluation Details -->
    <div class="rounded-lg border border-slate-200 bg-white p-5">
      <h4 class="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Evaluation Details
      </h4>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Evaluated By</label>
          <p class="text-sm text-slate-900">{{ candidate.evaluatedBy || '—' }}</p>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">Evaluation Date</label>
          <p class="text-sm text-slate-900">{{ candidate.evaluationDate || '—' }}</p>
        </div>
      </div>
      <div v-if="candidate.evaluationNotes" class="mt-4">
        <label class="mb-1 block text-xs font-medium text-slate-500">Notes</label>
        <p class="text-sm text-slate-700">{{ candidate.evaluationNotes }}</p>
      </div>
    </div>
  </div>
</template>
