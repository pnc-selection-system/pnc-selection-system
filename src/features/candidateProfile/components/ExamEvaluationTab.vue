<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Candidate } from '../types/index'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  candidate: Candidate
}>()

const editData = reactive({
  examScore: '',
  interviewScore: '',
  evaluatedBy: '',
  evaluationDate: '',
  evaluationNotes: '',
})

watch(
  () => props.candidate,
  (c) => {
    if (c) {
      editData.examScore = c.examScore?.toString() || ''
      editData.interviewScore = c.interviewScore?.toString() || ''
      editData.evaluatedBy = c.evaluatedBy || ''
      editData.evaluationDate = c.evaluationDate || ''
      editData.evaluationNotes = c.evaluationNotes || ''
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-6">
    <!-- Exam Score & Interview Score -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.examScore"
        label="EXAM SCORE"
        placeholder="0 - 100"
      />
      <BaseInput
        v-model="editData.interviewScore"
        label="INTERVIEW SCORE"
        placeholder="0 - 100"
      />
    </div>

    <!-- Evaluated By & Evaluation Date -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.evaluatedBy"
        label="EVALUATED BY"
        placeholder="Evaluator name"
      />
      <BaseInput
        v-model="editData.evaluationDate"
        label="EVALUATION DATE"
        placeholder="DD / MM / YYYY"
      />
    </div>

    <!-- Evaluation Notes -->
    <div class="flex flex-col gap-2">
      <label class="text-sm text-slate-600">EVALUATION NOTES</label>
      <textarea
        v-model="editData.evaluationNotes"
        placeholder="Evaluation notes..."
        rows="4"
        class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
      />
    </div>
  </div>
</template>
