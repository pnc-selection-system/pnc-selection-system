<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { SelectOption } from '@/components/base/BaseSelect.vue'
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

const candidateOptions = computed<SelectOption[]>(() =>
  props.candidates.map((c) => ({ value: c.id, label: c.name })),
)

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
    <div class="block">
      <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate</span>
      <BaseSelect
        v-model="selectedCandidateId"
        :options="candidateOptions"
        placeholder="Select candidate"
        class="mt-1.5 max-w-sm"
      />
    </div>

    <div class="mt-6 space-y-5">
      <div v-for="(question, i) in form.questions" :key="question.id" class="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
        <p class="text-sm font-semibold text-slate-800">Q{{ i + 1 }} · {{ question.title }}</p>

        <BaseInput
          v-if="question.type === 'short_text'"
          :model-value="String(answers[question.id] ?? '')"
          placeholder="Candidate's answer"
          class="mt-2"
          @update:model-value="answers[question.id] = $event"
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
      <BaseButton
        class="!w-auto"
        :disabled="!selectedCandidateId"
        @click="handleSubmit"
      >
        Submit response
      </BaseButton>
    </div>
  </div>
</template>