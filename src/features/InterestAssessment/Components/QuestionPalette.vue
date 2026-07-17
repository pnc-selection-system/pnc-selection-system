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
  <div class="rounded border border-slate-200 bg-white p-4">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Add question
    </p>

    <div class="mt-3 flex flex-col gap-2">
      <BaseButton
        v-for="type in questionTypes"
        :key="type"
        variant="secondary"
        style="width: 100% !important;"
        @click="$emit('addQuestion', type)"
      >
        <span class="flex w-full items-center justify-center gap-1">
          <span class="w-4 text-center">+</span>
          <span>{{ QUESTION_TYPE_LABELS[type] }}</span>
        </span>
      </BaseButton>
    </div>

    <div class="my-4 border-t border-slate-100" />

    <BaseButton
      variant="secondary"
      style="width: 100% !important;"
      @click="$emit('cloneFromYear', '2025')"
    >
      <span class="flex w-full items-center justify-center gap-1.5">
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M7 17h8a2 2 0 0 0 2-2V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Clone from 2025
      </span>
    </BaseButton>

  </div>
</template>