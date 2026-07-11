<script setup lang="ts">
import { QUESTION_TYPE_LABELS, type Question } from '../types/question'

const props = defineProps<{
  question: Question
  index: number
  selectedOption: string
  selectedScale: number
}>()

const emit = defineEmits<{
  'update:question': [value: Question]
  remove: []
  'select-scale': [value: number]
  'select-option': [questionId: string, option: string]
}>()

function updateTitle(e: Event) {
  emit('update:question', { ...props.question, title: (e.target as HTMLInputElement).value })
}

function updateWeight(e: Event) {
  emit('update:question', { ...props.question, weight: Number((e.target as HTMLInputElement).value) })
}

function handleScaleSelect(value: number) {
  emit('select-scale', value)
}

function handleOptionSelect(option: string) {
  console.log('QuestionCard: Option selected', option, 'for question', props.question.id)
  console.log('Current selectedOption:', props.selectedOption)
  emit('select-option', props.question.id, option)
}

function isOptionSelected(option: string): boolean {
  console.log('Checking if option selected:', option, 'selectedOption:', props.selectedOption)
  if (props.question.type === 'multi_choice') {
    const selected = props.selectedOption.split(',') || []
    const isSelected = selected.includes(option)
    console.log('Multi-choice result:', isSelected)
    return isSelected
  }
  const isSelected = props.selectedOption === option
  console.log('Single choice result:', isSelected)
  return isSelected
}
</script>

<template>
  <div class="rounded-lg border border-dashed border-slate-200 px-4 py-3.5 hover:border-slate-300">
    <div class="flex items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-1.5">
        <span class="shrink-0 text-sm font-semibold text-slate-800">Q{{ index + 1 }} ·</span>
        <input
          :value="question.title"
          class="min-w-0 flex-1 truncate border-none bg-transparent text-sm font-semibold text-slate-800 outline-none focus:bg-slate-50"
          @input="updateTitle"
        />
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <span class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-500">
          {{ QUESTION_TYPE_LABELS[question.type] }}
        </span>
        <span class="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-500">
          W:
          <input
            type="number"
            min="0"
            :value="question.weight"
            class="w-6 border-none bg-transparent text-center outline-none"
            @input="updateWeight"
          />
        </span>
        <button type="button" class="text-slate-300 hover:text-rose-500" @click="emit('remove')">
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="question.type === 'scale_1_5'" class="mt-3 flex gap-2">
      <button
        v-for="n in 5"
        :key="n"
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full border text-sm transition"
        :class="props.selectedScale === n ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
        @click="handleScaleSelect(n)"
      >
        {{ n }}
      </button>
    </div>

    <div v-else-if="question.type === 'single_choice' || question.type === 'multi_choice'" class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="option in question.options ?? ['Option A', 'Option B']"
        :key="option"
        type="button"
        class="rounded-md border-2 px-3 py-1.5 text-sm font-medium transition"
        :class="isOptionSelected(option) ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'"
        @click="handleOptionSelect(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>