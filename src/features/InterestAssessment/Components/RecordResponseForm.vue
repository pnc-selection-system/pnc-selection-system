<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import type { AssessmentForm } from '../types/question'
import type { AssessmentResponse, CandidateOption, QuestionAnswer } from '../types/response'

// ── Scale 1-5 color helpers ──
const SCALE_COLORS = [
  { ring: 'ring-red-200', bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600', bar: 'bg-red-400', check: 'text-red-500' },
  { ring: 'ring-orange-200', bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600', bar: 'bg-orange-400', check: 'text-orange-500' },
  { ring: 'ring-amber-200', bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-600', bar: 'bg-amber-400', check: 'text-amber-500' },
  { ring: 'ring-lime-200', bg: 'bg-lime-500', border: 'border-lime-500', text: 'text-lime-600', bar: 'bg-lime-400', check: 'text-lime-500' },
  { ring: 'ring-emerald-200', bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600', bar: 'bg-emerald-400', check: 'text-emerald-500' },
]

function getScaleColors(n: number) {
  return SCALE_COLORS[n - 1] ?? SCALE_COLORS[0]
}

function getScaleActiveClass(n: number) {
  const c = getScaleColors(n)
  return `${c.border} ${c.bg} text-white shadow-lg ${c.ring} ring-2 ring-offset-1`
}

function getScaleCheckClass(n: number) {
  return getScaleColors(n).check
}

function getScaleBarClass(n: number) {
  return getScaleColors(n).bar
}

function getScaleTextClass(n: number) {
  return getScaleColors(n).text
}

const props = defineProps<{
  form: AssessmentForm
  candidates: CandidateOption[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [response: AssessmentResponse]
}>()

const candidateInput = ref('')
const selectedCandidateId = ref('')
const showSuggestions = ref(false)
const answers = reactive<Record<string, string | string[] | number>>({})

// Filter candidates based on input (match by id or candidateCode or name)
const filteredCandidates = computed(() => {
  const q = candidateInput.value.trim().toLowerCase()
  if (!q) return []
  return props.candidates.filter((c) =>
    c.candidateCode.toLowerCase().includes(q) ||
    c.id.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q),
  )
})

// Exact match by candidate code or id
const matchedCandidate = computed(() => {
  const q = candidateInput.value.trim().toLowerCase()
  if (!q) return null
  return props.candidates.find(
    (c) => c.candidateCode.toLowerCase() === q || c.id.toLowerCase() === q,
  ) ?? null
})

function selectCandidate(candidate: CandidateOption) {
  selectedCandidateId.value = candidate.id
  candidateInput.value = candidate.candidateCode
  showSuggestions.value = false
}

function handleInputFocus() {
  if (candidateInput.value.trim() && filteredCandidates.value.length > 0) {
    showSuggestions.value = true
  }
}

function handleInputBlur() {
  // Delay hiding so click on suggestion can register
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && filteredCandidates.value.length === 1) {
    selectCandidate(filteredCandidates.value[0])
  }
  if (event.key === 'Escape') {
    showSuggestions.value = false
  }
}

// Reset selected when input changes
watch(candidateInput, () => {
  if (!matchedCandidate.value) {
    selectedCandidateId.value = ''
  }
  if (candidateInput.value.trim() && filteredCandidates.value.length > 0) {
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
})

function toggleMultiOption(questionId: string, option: string) {
  const current = (answers[questionId] as string[]) ?? []
  answers[questionId] = current.includes(option)
    ? current.filter((o) => o !== option)
    : [...current, option]
}

function handleSubmit() {
  if (props.submitting) return
  const questionAnswers: QuestionAnswer[] = props.form.questions.map((q) => ({
    questionId: q.id,
    value: answers[q.id] ?? '',
  }))
  emit('submit', { candidateId: selectedCandidateId.value, answers: questionAnswers })
}
</script>

<template>
  <!-- Response form -->
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <!-- Candidate ID Input -->
    <div class="relative">
      <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate</span>
      <div class="relative mt-1.5">
        <div class="relative">
          <input
            :value="candidateInput"
            type="text"
            placeholder="Enter candidate ID or code... e.g. C-1042"
            class="w-full rounded-lg border px-3 py-2.5 pr-10 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            :class="{
              'border-emerald-300 bg-emerald-50': matchedCandidate && selectedCandidateId,
              'border-rose-300 bg-rose-50': candidateInput.trim() && !matchedCandidate && !filteredCandidates.length,
              'border-slate-300': !candidateInput.trim() || (!matchedCandidate && filteredCandidates.length > 0),
            }"
            @input="candidateInput = ($event.target as HTMLInputElement).value"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @keydown="handleKeydown"
          />
          <!-- Status icon -->
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
            <svg v-if="matchedCandidate && selectedCandidateId" class="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="candidateInput.trim() && !matchedCandidate && !filteredCandidates.length" class="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="candidateInput.trim() && filteredCandidates.length > 1" class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>

        <!-- Suggestion dropdown -->
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="showSuggestions && filteredCandidates.length > 0 && !matchedCandidate"
            class="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            <button
              v-for="candidate in filteredCandidates"
              :key="candidate.id"
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
              @mousedown.prevent="selectCandidate(candidate)"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {{ candidate.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-800">
                  <span class="font-mono text-xs text-blue-600">{{ candidate.candidateCode }}</span>
                  · {{ candidate.name }}
                </p>
                <p class="mt-0.5 text-xs text-slate-400">
                  {{ candidate.province }}
                  <span v-if="candidate.organization"> · {{ candidate.organization }}</span>
                </p>
              </div>
            </button>
            <p class="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
              {{ filteredCandidates.length }} candidate{{ filteredCandidates.length > 1 ? 's' : '' }} found
            </p>
          </div>
        </transition>
      </div>

      <!-- Matched candidate detail card -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="scale-95 opacity-0 -translate-y-1"
        enter-to-class="scale-100 opacity-100 translate-y-0"
      >
        <div
          v-if="matchedCandidate && selectedCandidateId"
          class="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3"
        >
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              {{ matchedCandidate.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-800">{{ matchedCandidate.name }}</p>
              <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                <span class="inline-flex items-center gap-1">
                  <svg class="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ matchedCandidate.province }}
                </span>
                <span v-if="matchedCandidate.organization" class="inline-flex items-center gap-1">
                  <svg class="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {{ matchedCandidate.organization }}
                </span>
                <span v-if="matchedCandidate.status" class="inline-flex items-center gap-1">
                  <svg class="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  {{ matchedCandidate.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Not found state -->
      <p
        v-if="candidateInput.trim() && !matchedCandidate && filteredCandidates.length === 0"
        class="mt-1.5 text-xs text-rose-500"
      >
        No candidate found with this ID
      </p>
      <p
        v-else-if="!candidateInput.trim()"
        class="mt-1.5 text-xs text-slate-400"
      >
        Enter the candidate code (e.g. C-1042) or ID to search
      </p>
    </div>

    <!-- Questions -->
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

        <div v-else-if="question.type === 'scale_1_5'" class="mt-2">
          <div class="flex items-center gap-1.5">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 text-sm font-bold transition-all duration-150 ease-out"
              :class="[
                answers[question.id] === n
                  ? getScaleActiveClass(n)
                  : 'border-slate-200 bg-white text-slate-500 hover:scale-110 hover:border-slate-300 hover:shadow-md',
              ]"
              @click="answers[question.id] = n"
            >
              {{ n }}
              <!-- Selected indicator dot -->
              <span
                v-if="answers[question.id] === n"
                class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <svg class="h-2.5 w-2.5" :class="getScaleCheckClass(n)" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
          <!-- Scale labels -->
          <div class="mt-1.5 flex justify-between px-0.5">
            <span class="text-[11px] font-medium text-red-500">Low</span>
            <span class="text-[11px] font-medium text-amber-500">Medium</span>
            <span class="text-[11px] font-medium text-emerald-500">High</span>
          </div>
          <!-- Score preview: actual backend normalization is (value - min) / (max - min) with min=1, max=5 → (value-1)/4 -->
          <div v-if="answers[question.id]" class="mt-2 flex items-center gap-2">
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full transition-all duration-500 ease-out"
                :class="getScaleBarClass(answers[question.id] as number)"
                :style="{ width: (((answers[question.id] as number) - 1) / 4) * 100 + '%' }"
              />
            </div>
            <span class="text-xs font-semibold" :class="getScaleTextClass(answers[question.id] as number)">
              {{ Math.round((((answers[question.id] as number) - 1) / 4) * 100) }}%
            </span>
          </div>
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

    <div class="mt-6 flex items-center justify-between">
      <p v-if="!selectedCandidateId" class="text-xs text-slate-400">Enter and select a valid candidate to enable submission</p>
      <div v-else />
      <BaseButton
        :loading="submitting"
        :disabled="!selectedCandidateId || submitting"
        @click="handleSubmit"
      >
        Submit response
      </BaseButton>
    </div>
  </div>
</template>