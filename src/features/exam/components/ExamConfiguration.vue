<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue'
import { useExamConfig, defaultExamConfig } from '../service/useExamConfig'
import { useSubjects } from '../service/useSubjects'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import ExamConfigPreview from './ExamConfigPreview.vue'

const props = defineProps<{
  campaignId: number | null
}>()

const campaignIdRef = toRef(props, 'campaignId')

const { config, isSaving, lastSavedFormatted, saveConfiguration, resetConfiguration, validateConfiguration, loading, error: configError } = useExamConfig(campaignIdRef)
const { isValidWeight, totalWeight, currentCampaignId, setCampaignId } = useSubjects()

watch(() => props.campaignId, (newVal) => {
  setCampaignId(newVal ?? null)
}, { immediate: true })

const overallPassMark = ref(config.value.overallPassMark)
const perSubjectMin = ref(config.value.perSubjectMin)
const mustPassEverySubject = ref(config.value.mustPassEverySubject)

const saveSuccess = ref(false)
const saveError = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

// Watch for external config changes
watch(config, (newConfig) => {
  overallPassMark.value = newConfig.overallPassMark
  perSubjectMin.value = newConfig.perSubjectMin
  mustPassEverySubject.value = newConfig.mustPassEverySubject
})

// Live preview sample scores
const sampleScores = ref([78, 71, 80, 30])

const weightedScore = computed(() => {
  const sum = sampleScores.value.reduce((a: number, b: number) => a + b, 0)
  return (sum / sampleScores.value.length).toFixed(1)
})

const previewResult = computed(() => {
  const score = parseFloat(weightedScore.value)
  if (mustPassEverySubject.value && sampleScores.value.some((s: number) => s < perSubjectMin.value)) {
    return 'FAIL'
  }
  return score >= overallPassMark.value ? 'PASS' : 'FAIL'
})

const previewResultColor = computed(() => {
  return previewResult.value === 'PASS'
    ? { bg: '#DCFCE7', text: '#16A34A' }
    : { bg: '#FEE2E2', text: '#DC2626' }
})

const canSave = computed(() => {
  return props.campaignId !== null
})

function validate(): boolean {
  const result = validateConfiguration({
    overallPassMark: overallPassMark.value,
    perSubjectMin: perSubjectMin.value,
    mustPassEverySubject: mustPassEverySubject.value,
  })
  errors.value = result.errors
  return result.valid
}

async function saveConfig() {
  saveSuccess.value = false
  saveError.value = null

  if (!validate()) return

  // Weight validation is handled in the SubjectsTable component

  const result = await saveConfiguration({
    overallPassMark: overallPassMark.value,
    perSubjectMin: perSubjectMin.value,
    mustPassEverySubject: mustPassEverySubject.value,
  })

  if (result.success) {
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } else if (!result.success && result.errors) {
    saveError.value = Object.values(result.errors)[0] ?? null
  }
}

function resetConfig() {
  resetConfiguration()
  saveSuccess.value = false
  saveError.value = null
  errors.value = {}
  // Reset local refs to defaults from service
  overallPassMark.value = defaultExamConfig.overallPassMark
  perSubjectMin.value = defaultExamConfig.perSubjectMin
  mustPassEverySubject.value = defaultExamConfig.mustPassEverySubject
}
</script>

<template>
  <div class="rounded bg-white shadow-sm ring-1 ring-slate-200/60">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">Pass / Fail Thresholds</h3>
        <p class="mt-0.5 text-xs text-slate-400">Configure grading thresholds</p>
      </div>
      <div v-if="lastSavedFormatted" class="text-xs text-slate-400">
        Last saved: {{ lastSavedFormatted }}
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden">
      <table class="min-w-full table-fixed text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50">
            <th class="w-[35%] px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Setting</th>
            <th class="w-[65%] px-4 py-2.5 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-slate-100 transition-colors duration-150 hover:bg-blue-50/30">
            <td class="px-4 py-2 text-xs text-slate-600">Overall Pass Mark</td>
            <td class="px-4 py-2">
              <div class="inline-flex items-center gap-1.5">
                <BaseInput
                  :model-value="String(overallPassMark)"
                  type="number"
                  min="0"
                  max="100"
                  class="!w-20"
                  @update:model-value="overallPassMark = Number($event)"
                />
                <span class="text-xs text-slate-400">%</span>
              </div>
              <p v-if="errors.overallPassMark" class="mt-1 text-xs text-rose-500">{{ errors.overallPassMark }}</p>
            </td>
          </tr>
          <tr class="border-b border-slate-100 transition-colors duration-150 hover:bg-blue-50/30">
            <td class="px-4 py-2 text-xs text-slate-600">Per-Subject Minimum</td>
            <td class="px-4 py-2">
              <div class="inline-flex items-center gap-1.5">
                <BaseInput
                  :model-value="String(perSubjectMin)"
                  type="number"
                  min="0"
                  max="100"
                  class="!w-20"
                  @update:model-value="perSubjectMin = Number($event)"
                />
                <span class="text-xs text-slate-400">%</span>
              </div>
              <p v-if="errors.perSubjectMin" class="mt-1 text-xs text-rose-500">{{ errors.perSubjectMin }}</p>
            </td>
          </tr>
          <tr class="border-b-0 transition-colors duration-150 hover:bg-blue-50/30">
            <td class="px-4 py-2" colspan="2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="mustPassEverySubject"
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-xs text-slate-600">Must Pass Every Subject</span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ExamConfigPreview
      :sample-scores="sampleScores"
      :weighted-score="weightedScore"
      :preview-result="previewResult"
      :preview-result-color="previewResultColor"
    />

    <!-- Feedback Messages -->
    <div v-if="saveSuccess || saveError" class="border-t border-slate-100 px-6 py-3">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="saveSuccess"
          class="flex items-center gap-2 rounded bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Configuration saved successfully!
        </div>
        <div
          v-else-if="saveError"
          class="flex items-center gap-2 rounded bg-rose-50 px-4 py-2.5 text-sm text-rose-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ saveError }}
        </div>
      </Transition>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
      <BaseButton
        @click="resetConfig"
        variant="secondary"
      >
        Reset to Default
      </BaseButton>
      <BaseButton
        @click="saveConfig"
        :disabled="isSaving || !canSave"
        :loading="isSaving"
        variant="primary"
      >
        Save Configuration
      </BaseButton>
    </div>
  </div>
</template>
