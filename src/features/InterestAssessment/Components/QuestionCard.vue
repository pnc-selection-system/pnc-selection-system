<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { QUESTION_TYPE_LABELS, type Question, type QuestionType } from '../types/question'

const props = defineProps<{
  question: Question
  index: number
  selectedOption: string
  selectedScale: number
  isDragging?: boolean
  isDropTarget?: boolean
}>()

const emit = defineEmits<{
  'update:question': [value: Question]
  remove: []
  'select-scale': [value: number]
  'select-option': [questionId: string, option: string]
}>()

const questionTypes: QuestionType[] = ['short_text', 'single_choice', 'multi_choice', 'scale_1_5']

const optionInputRefs = ref<HTMLInputElement[]>([])

function updateTitle(e: Event) {
  emit('update:question', { ...props.question, title: (e.target as HTMLInputElement).value })
}

function updateWeight(e: Event) {
  emit('update:question', { ...props.question, weight: Number((e.target as HTMLInputElement).value) })
}

function updateType(newType: QuestionType) {
  if (newType === props.question.type) return

  const updated: Question = { ...props.question, type: newType }

  // Adjust options based on type change
  if (newType === 'single_choice' || newType === 'multi_choice') {
    // Switching to a choice type — ensure default options exist
    if (!updated.options || updated.options.length === 0) {
      updated.options = ['Option A', 'Option B']
    }
  } else {
    // Switching away from a choice type — clean up options
    delete updated.options
  }

  emit('update:question', updated)
}

function handleScaleSelect(value: number) {
  emit('select-scale', value)
}

function handleOptionSelect(option: string) {
  emit('select-option', props.question.id, option)
}

function isOptionSelected(option: string): boolean {
  if (props.question.type === 'multi_choice') {
    const selected = props.selectedOption.split(',') || []
    return selected.includes(option)
  }
  return props.selectedOption === option
}

// ── Editable options (Google Forms style) ──

function updateOptionText(index: number, e: Event) {
  const newText = (e.target as HTMLInputElement).value
  const options = [...(props.question.options || [])]
  options[index] = newText
  emit('update:question', { ...props.question, options })
}

function addOption() {
  const options = [...(props.question.options || [])]
  const newIndex = options.length
  const nextLabel = newIndex < 26 ? String.fromCharCode(65 + newIndex) : String(newIndex + 1)
  options.push(`Option ${nextLabel}`)
  emit('update:question', { ...props.question, options })
  
  // Focus the newly added option on next tick
  nextTick(() => {
    const inputs = optionInputRefs.value
    if (inputs && inputs[newIndex]) {
      inputs[newIndex].focus()
      inputs[newIndex].select()
    }
  })
}

function removeOption(index: number) {
  const options = [...(props.question.options || [])]
  if (options.length <= 1) return // Don't allow removing the last option
  options.splice(index, 1)
  emit('update:question', { ...props.question, options })
}

function handleOptionKeydown(e: KeyboardEvent, index: number) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addOption()
  }
  if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && index > 0) {
    e.preventDefault()
    removeOption(index)
  }
}

function setOptionInputRef(el: HTMLInputElement | null, index: number) {
  if (el) {
    optionInputRefs.value[index] = el
  }
}
</script>

<template>
  <div
    class="question-card rounded-lg border border-dashed px-4 py-3.5 transition-shadow"
    :class="[
      isDragging ? 'border-blue-300 bg-blue-50/40 opacity-50' : 'border-slate-200 hover:border-slate-300',
      isDropTarget ? 'border-blue-500 ring-2 ring-blue-100' : ''
    ]"
  >
    <!-- Question header: title + controls -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-1.5">
        <span
          class="drag-handle shrink-0 cursor-grab text-slate-300 hover:text-slate-400 active:cursor-grabbing"
          title="Drag to reorder"
        >
          <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </span>
        <span class="shrink-0 text-sm font-semibold text-slate-800">Q{{ index + 1 }} ·</span>
        <input
          :value="question.title"
          class="min-w-0 flex-1 truncate border-none bg-transparent text-sm font-semibold text-slate-800 outline-none focus:bg-slate-50"
          @input="updateTitle"
        />
      </div>

      <div class="flex shrink-0 items-center gap-1.5">
        <select
          :value="question.type"
          class="qtype-select rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600 outline-none hover:bg-slate-200 focus:ring-2 focus:ring-blue-100 focus:bg-white"
          @change="(e: Event) => updateType((e.target as HTMLSelectElement).value as QuestionType)"
        >
          <option
            v-for="t in questionTypes"
            :key="t"
            :value="t"
          >
            {{ QUESTION_TYPE_LABELS[t] }}
          </option>
        </select>
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
        <button
          type="button"
          class="group flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
          title="Drop question"
          @click="emit('remove')"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M8 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m3 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 9v5M13 9v5M7 9v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 transition group-hover:opacity-100" />
          </svg>
          <span class="hidden group-hover:inline">Drop</span>
        </button>
      </div>
    </div>

    <!-- Scale 1-5 preview -->
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

    <!-- Short text preview -->
    <div v-else-if="question.type === 'short_text'" class="mt-3">
      <div class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
        Short text answer...
      </div>
    </div>

    <!-- Editable options for Single choice / Multi choice (Google Forms style) -->
    <div v-else-if="question.type === 'single_choice' || question.type === 'multi_choice'" class="mt-3 space-y-1.5">
      <div
        v-for="(option, optIndex) in question.options || []"
        :key="optIndex"
        class="group flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-slate-50"
      >
        <!-- Type indicator icon -->
        <span class="shrink-0 text-slate-400">
          <!-- Radio circle for single choice -->
          <svg v-if="question.type === 'single_choice'" class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" />
            <circle v-if="isOptionSelected(option)" cx="12" cy="12" r="5" fill="#3B82F6" />
          </svg>
          <!-- Checkbox for multi choice -->
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="2" />
            <rect v-if="isOptionSelected(option)" x="6" y="6" width="12" height="12" rx="2" fill="#3B82F6" />
          </svg>
        </span>

        <!-- Editable option text -->
        <input
          :ref="(el: any) => setOptionInputRef(el as HTMLInputElement | null, optIndex)"
          :value="option"
          type="text"
          class="flex-1 border-0 border-b-2 border-transparent bg-transparent px-1 py-0.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-blue-50/40"
          placeholder="Enter option text..."
          @input="(e: Event) => updateOptionText(optIndex, e)"
          @keydown="(e: KeyboardEvent) => handleOptionKeydown(e, optIndex)"
        />

        <!-- Remove option button -->
        <button
          type="button"
          class="shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition hover:text-rose-500 group-hover:opacity-100"
          title="Remove option"
          :disabled="(question.options?.length || 0) <= 1"
          @click="removeOption(optIndex)"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Add option button -->
      <button
        type="button"
        class="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
        @click="addOption"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
          <path d="M10 5v10M5 10h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span class="font-medium">Add option</span>
      </button>

      <!-- Hint about keyboard shortcuts -->
      <p class="mt-2 text-[10px] text-slate-400">
        Press <kbd class="rounded border border-slate-200 bg-slate-50 px-1 font-mono text-[9px]">Enter</kbd> to add another ·
        <kbd class="rounded border border-slate-200 bg-slate-50 px-1 font-mono text-[9px]">Backspace</kbd> empty to remove
      </p>
    </div>
  </div>
</template>

<style scoped>
.qtype-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='6' fill='none'%3E%3Cpath d='M1 1.5l3 3 3-3' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
  padding-right: 20px;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.qtype-select option {
  font-size: 12px;
  padding: 4px 8px;
}

/* Style for keyboard shortcut kbd tags */
kbd {
  line-height: 1.4;
}
</style>