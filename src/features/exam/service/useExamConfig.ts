import { ref, computed, watch, type Ref } from 'vue'
import { useCacheFetch, prefetchCache } from '@/composables/useCacheFetch'
import * as examThresholdService from './examThresholdService'
import type { CampaignThresholds } from './examThresholdService'

export interface ExamConfig {
  overallPassMark: number
  perSubjectMin: number
  mustPassEverySubject: boolean
}

const defaultConfig: ExamConfig = {
  overallPassMark: 60,
  perSubjectMin: 40,
  mustPassEverySubject: false,
}

export const defaultExamConfig: ExamConfig = { ...defaultConfig }

export function useExamConfig(campaignIdRef: Ref<number | null>) {
  const config = ref<ExamConfig>({ ...defaultConfig })
  const isSaving = ref(false)
  const lastSaved = ref<Date | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- In-memory cached fetch (same pattern as campaigns & subjects) ----
  const {
    data: thresholdsData,
    loading: cacheLoading,
    error: cacheError,
    refresh: loadConfiguration,
  } = useCacheFetch<CampaignThresholds | null>(
    () => (campaignIdRef.value ? `exam-config:${campaignIdRef.value}` : ''),
    () => examThresholdService.fetchCampaignThresholds(campaignIdRef.value!),
    { ttl: 60_000 },
  )

  // Sync cache data into the local config ref
  watch(thresholdsData, (val) => {
    if (val?.overall) {
      config.value = {
        overallPassMark: Number(val.overall.overall_pass_mark),
        perSubjectMin: Number(val.overall.per_subject_min),
        mustPassEverySubject: val.overall.must_pass_every_subject ?? false,
      }
    } else {
      config.value = { ...defaultConfig }
    }
  })

  // Sync loading/error from cached fetch
  watch(cacheLoading, (val) => { loading.value = val }, { immediate: true })
  watch(cacheError, (val) => { error.value = val }, { immediate: true })

  function validateConfiguration(cfg: ExamConfig): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (cfg.overallPassMark < 0 || cfg.overallPassMark > 100) {
      errors.overallPassMark = 'Overall pass mark must be between 0 and 100'
    }

    if (cfg.perSubjectMin < 0 || cfg.perSubjectMin > 100) {
      errors.perSubjectMin = 'Per-subject minimum must be between 0 and 100'
    }

    if (cfg.perSubjectMin > cfg.overallPassMark) {
      errors.perSubjectMin = 'Per-subject minimum cannot be greater than overall pass mark'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  async function saveConfiguration(cfg: ExamConfig): Promise<{ success: boolean; errors?: Record<string, string> }> {
    if (!campaignIdRef.value) {
      return { success: false, errors: { general: 'No campaign selected' } }
    }

    const validation = validateConfiguration(cfg)
    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }

    try {
      isSaving.value = true
      error.value = null

      const result = await examThresholdService.saveOverallThreshold(campaignIdRef.value, {
        overall_pass_mark: cfg.overallPassMark,
        per_subject_min: cfg.perSubjectMin,
        must_pass_every_subject: cfg.mustPassEverySubject,
      })

      // Update reactive state
      config.value = { ...cfg }
      lastSaved.value = new Date()

      // Update the in-memory cache so next visit is instant
      const key = `exam-config:${campaignIdRef.value}`
      prefetchCache(key, {
        overall: result,
        subjects: [],
      } as CampaignThresholds)

      return { success: true }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to save configuration'
      error.value = errorMessage
      return { success: false, errors: { general: errorMessage } }
    } finally {
      isSaving.value = false
    }
  }

  function resetConfiguration(): void {
    config.value = { ...defaultConfig }
    lastSaved.value = null
    error.value = null
  }

  const lastSavedFormatted = computed(() => {
    if (!lastSaved.value) return null
    return lastSaved.value.toLocaleTimeString()
  })

  return {
    config,
    isSaving,
    lastSaved,
    lastSavedFormatted,
    loading,
    error,
    saveConfiguration,
    resetConfiguration,
    validateConfiguration,
    loadConfiguration,
  }
}
