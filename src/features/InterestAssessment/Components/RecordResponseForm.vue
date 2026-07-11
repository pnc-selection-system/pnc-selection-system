<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { AssessmentForm } from '../types/question'
import type { AssessmentResponse, CandidateOption, QuestionAnswer } from '../types/response'

const props = defineProps<{
  form: AssessmentForm
  candidates: CandidateOption[]
}>()

const emit = defineEmits<{
  submit: [response: AssessmentResponse]
}>()

const selectedCandidateId = ref('')
const answers = reactive<Record<string, string | string[] | number>>({})

function toggleMultiOption(questionId: string, option: string) {
  const current = (answers[questionId] as string[]) ?? []
  answers[questionId] = current.includes(option)
    ? current.filter((o) => o !== option)
    : [...current, option]
}

function handleSubmit() {
  const questionAnswers: QuestionAnswer[] = props.form.questions.map((q) => ({
    questionId: q.id,
    value: answers[q.id] ?? '',
  }))
  emit('submit', { candidateId: selectedCandidateId.value, answers: questionAnswers })
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <label class="block">
      <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate</span>
      <select
        v-model="selectedCandidateId"
        class="mt-1.5 w-full max-w-sm rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <option value="" disabled>Select candidate</option>
        <option v-for="c in candidates" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
    </label>

    <div class="mt-6 space-y-5">
      <div v-for="(question, i) in form.questions" :key="question.id" class="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
        <p class="text-sm font-semibold text-slate-800">Q{{ i + 1 }} · {{ question.title }}</p>

        <input
          v-if="question.type === 'short_text'"
          v-model="answers[question.id]"
          type="text"
          class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Candidate's answer"
        />

        <div v-else-if="question.type === 'scale_1_5'" class="mt-2 flex gap-2">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border text-sm"
            :class="answers[question.id] === n ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'"
            @click="answers[question.id] = n"
          >
            {{ n }}
          </button>
        </div>

        <div v-else-if="question.type === 'single_choice'" class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="option in question.options ?? []"
            :key="option"
            type="button"
            class="rounded-md border px-3 py-1.5 text-sm"
            :class="answers[question.id] === option ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'"
            @click="answers[question.id] = option"
          >
            {{ option }}
          </button>
        </div>

        <div v-else-if="question.type === 'multi_choice'" class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="option in question.options ?? []"
            :key="option"
            type="button"
            class="rounded-md border px-3 py-1.5 text-sm"
            :class="
              ((answers[question.id] as string[]) ?? []).includes(option)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            "
            @click="toggleMultiOption(question.id, option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!selectedCandidateId"
        @click="handleSubmit"
      >
        Submit response
      </button>
    </div>
  </div>
</template>