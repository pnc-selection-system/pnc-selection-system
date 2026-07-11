<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import { QUESTION_TYPE_LABELS, type QuestionType } from '../types/question'

defineEmits<{
  addQuestion: [type: QuestionType]
  cloneFromYear: [year: string]
}>()

const questionTypes: QuestionType[] = ['short_text', 'single_choice', 'multi_choice', 'scale_1_5']
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Add question
    </p>

    <div class="mt-3 space-y-2">
      <BaseButton
        v-for="type in questionTypes"
        :key="type"
        variant="secondary"
        @click="$emit('addQuestion', type)"
      >
        + {{ QUESTION_TYPE_LABELS[type] }}
      </BaseButton>
    </div>

    <div class="my-4 border-t border-slate-100" />

    <BaseButton
      variant="secondary"
      @click="$emit('cloneFromYear', '2025')"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" />
        <path d="M7 17h8a2 2 0 0 0 2-2V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      Clone from 2025
    </BaseButton>

    <div class="mt-4 flex items-start gap-2.5 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-3">
      <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
        1
      </span>
      <p class="text-xs text-amber-800">
        Forms clone across campaigns (FR-AS-5).
      </p>
    </div>
  </div>
</template>