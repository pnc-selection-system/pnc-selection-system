<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useExamConfig, defaultExamConfig } from '../service/useExamConfig'
import { useSubjects } from '../service/useSubjects'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { config, isSaving, lastSavedFormatted, saveConfiguration, resetConfiguration, validateConfiguration } = useExamConfig()
const { isValidWeight } = useSubjects()

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
  const sum = sampleScores.value.reduce((a, b) => a + b, 0)
  return (sum / sampleScores.value.length).toFixed(1)
})

const previewResult = computed(() => {
  const score = parseFloat(weightedScore.value)
  if (mustPassEverySubject.value && sampleScores.value.some((s) => s < perSubjectMin.value)) {
    return 'FAIL'
  }
  return score >= overallPassMark.value ? 'PASS' : 'FAIL'
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

function saveConfig() {
  saveSuccess.value = false
  saveError.value = null

  if (!validate()) return

  // Check if subject weights are valid
  if (!isValidWeight.value) {
    saveError.value = 'Subject weights must total 100% before saving configuration'
    return
  }

  const result = saveConfiguration({
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
    saveError.value = Object.values(result.errors)[0]
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
        <h3 class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Pass / Fail Thresholds</h3>

      </div>
      <div v-if="lastSavedFormatted" class="text-xs text-slate-400">
        Last saved: {{ lastSavedFormatted }}
      </div>
    </div>

    <!-- Fields -->
    <div class="divide-y divide-slate-100">
      <div class="px-6 py-4">
        <label class="mb-2 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
          Overall Pass Mark
        </label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="overallPassMark"
            type="number"
            min="0"
            max="100"
            :class="[
              'w-full rounded border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition',
              errors.overallPassMark
                ? 'border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
            ]"
          />
          <span class="shrink-0 text-sm text-slate-400">%</span>
        </div>
        <p v-if="errors.overallPassMark" class="mt-1.5 text-xs text-rose-500">{{ errors.overallPassMark }}</p>
      </div>

      <div class="px-6 py-4">
        <label class="mb-2 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
          Per-Subject Minimum
        </label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="perSubjectMin"
            type="number"
            min="0"
            max="100"
            :class="[
              'w-full rounded border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition',
              errors.perSubjectMin
                ? 'border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
            ]"
          />
          <span class="shrink-0 text-sm text-slate-400">%</span>
        </div>
        <p v-if="errors.perSubjectMin" class="mt-1.5 text-xs text-rose-500">{{ errors.perSubjectMin }}</p>
      </div>

      <div class="px-6 py-4">
        <label class="inline-flex cursor-pointer items-center gap-2.5">
          <input
            v-model="mustPassEverySubject"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm text-slate-700">Must Pass Every Subject</span>
        </label>
      </div>
    </div>

    <!-- Live Preview -->
    <div class="border-t border-slate-100 px-6 py-4">
      <h4 class="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">Live Preview</h4>
      <div class="whitespace-nowrap rounded border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        Sample {{ sampleScores.join(' / ') }} → weighted
        <span class="font-medium text-slate-800">{{ weightedScore }}</span>
        →
        <BaseBadge :type="previewResult === 'PASS' ? 'success' : 'danger'" size="small" class="!rounded">
          {{ previewResult }}
        </BaseBadge>
      </div>
    </div>

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
        variant="secondary"
        class="!w-auto !rounded !px-4 !py-2.5 !text-sm"
        @click="resetConfig"
      >
        Reset to Default
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="isSaving"
        :loading="isSaving"
        class="!w-auto !rounded !px-6 !py-2.5 !text-sm"
        @click="saveConfig"
      >
        Save Configuration
      </BaseButton>
    </div>
  </div>
</template>
