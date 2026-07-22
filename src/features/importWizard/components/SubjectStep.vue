<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { fetchSubjects } from '@/features/exam/service/examSubjectService'
import type { SubjectOption } from '../types/mapping'

const props = defineProps<{
  campaignId?: number | null
}>()

const emit = defineEmits<{
  proceed: [subjectId: number, subjectName: string]
}>()

const subjects = ref<SubjectOption[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedSubjectId = ref<number | null>(null)

async function loadSubjects() {
  if (!props.campaignId) {
    subjects.value = []
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  try {
    const apiSubjects = await fetchSubjects(props.campaignId)
    subjects.value = apiSubjects.map((s) => ({
      id: s.id,
      name: s.name,
      maxScore: Number(s.max_score),
      weight: Number(s.weight),
    }))
  } catch (err) {
    error.value = 'Failed to load subjects from exam configuration.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleProceed() {
  if (!selectedSubjectId.value) return
  const subject = subjects.value.find(s => s.id === selectedSubjectId.value)
  if (subject) {
    emit('proceed', subject.id, subject.name)
  }
}

watch(() => props.campaignId, () => {
  loadSubjects()
}, { immediate: true })

onMounted(loadSubjects)
</script>

<template>
  <div class="rounded border border-slate-200 bg-white">
    <div class="border-b border-slate-100 px-5 py-4">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Select subject
      </p>
      <p class="mt-1 text-sm text-slate-500">
        Choose which subject you want to import exam results for.
      </p>
    </div>

    <div class="px-5 py-6">
      <label class="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-wider text-slate-500">
        Subject
      </label>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center gap-2 py-2">
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        <span class="text-sm text-slate-400">Loading subjects…</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="rounded-md border border-dashed border-red-200 bg-red-50 px-4 py-4 text-center">
        <p class="text-sm text-red-600">{{ error }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          @click="loadSubjects()"
        >
          Retry
        </button>
      </div>

      <!-- No campaign selected -->
      <div v-else-if="!campaignId" class="rounded-md border border-dashed border-amber-200 bg-amber-50 px-4 py-4 text-center">
        <p class="text-sm text-amber-700">No campaign selected.</p>
        <p class="mt-1 text-xs text-amber-500">Please select a campaign first.</p>
      </div>

      <!-- No subjects configured -->
      <div v-else-if="subjects.length === 0" class="rounded-md border border-dashed border-amber-200 bg-amber-50 px-4 py-4 text-center">
        <p class="text-sm text-amber-700">No subjects found in exam configuration.</p>
        <p class="mt-1 text-xs text-amber-500">Add subjects in Exam Configuration first, then come back.</p>
      </div>

      <!-- Subject dropdown -->
      <div v-else class="relative max-w-md">
        <select
          v-model="selectedSubjectId"
          class="w-full appearance-none rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option :value="null" disabled>Select a subject…</option>
          <option v-for="subj in subjects" :key="subj.id" :value="subj.id">
            {{ subj.name }} — Max: {{ subj.maxScore }}, Weight: {{ subj.weight }}%
          </option>
        </select>
        <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <div class="flex items-center justify-end border-t border-slate-100 px-5 py-4">
      <BaseButton :disabled="!selectedSubjectId" @click="handleProceed">
        Continue to upload ›
      </BaseButton>
    </div>
  </div>
</template>
