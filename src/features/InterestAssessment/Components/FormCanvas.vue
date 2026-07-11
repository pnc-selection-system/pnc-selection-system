<script setup lang="ts">
import QuestionCard from './QuestionCard.vue'
import PassThresholdBar from './PassThresholdBar.vue'
import type { Question } from '../types/question'

const props = defineProps<{
  formName: string
  questions: Question[]
  passThreshold: number
  selectedOptions: Record<string, string>
  selectedScales: Record<string, number>
}>()

const emit = defineEmits<{
  'update:questions': [value: Question[]]
  'update:passThreshold': [value: number]
  save: []
  'select-scale': [questionId: string, value: number]
  'select-option': [questionId: string, option: string]
}>()

function updateQuestion(index: number, question: Question) {
  const next = props.questions.map((q, i) => (i === index ? question : q))
  emit('update:questions', next)
}

function removeQuestion(index: number) {
  const next = props.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))
  emit('update:questions', next)
}

function handleScaleSelect(questionId: string, value: number) {
  emit('select-scale', questionId, value)
}

function handleOptionSelect(questionId: string, option: string) {
  console.log('FormCanvas: handleOptionSelect', { questionId, option })
  emit('select-option', questionId, option)
}

function handleSaveClick() {
  console.log('FormCanvas: Save button clicked, forwarding to parent')
  emit('save')
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Form canvas · "{{ formName }}"
    </p>

    <div class="mt-4 space-y-3">
      <QuestionCard
        v-for="(question, i) in questions"
        :key="question.id"
        :question="question"
        :index="i"
        :selected-option="selectedOptions[question.id] || ''"
        :selected-scale="selectedScales[question.id] || 0"
        @update:question="updateQuestion(i, $event)"
        @remove="removeQuestion(i)"
        @select-scale="handleScaleSelect(question.id, $event)"
        @select-option="handleOptionSelect"
      />
    </div>

    <PassThresholdBar
      :model-value="passThreshold"
      @update:model-value="emit('update:passThreshold', $event)"
      @save="handleSaveClick"
    />
  </div>
</template>