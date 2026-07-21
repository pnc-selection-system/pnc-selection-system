import { ref, computed, watch, type Ref } from 'vue'
import * as examThresholdService from './examThresholdService'

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

  // Watch for campaignId changes and reload configuration
  watch(campaignIdRef, (newCampaignId) => {
    if (newCampaignId) {
      loadConfiguration()
    } else {
      config.value = { ...defaultConfig }
    }
  }, { immediate: true })

  /**
   * Load configuration from API
   */
  async function loadConfiguration() {
    if (!campaignIdRef.value) {
      config.value = { ...defaultConfig }
      return
    }

    try {
      loading.value = true
      error.value = null

      const thresholds = await examThresholdService.fetchCampaignThresholds(campaignIdRef.value)

      if (thresholds.overall) {
        config.value = {
          overallPassMark: Number(thresholds.overall.overall_pass_mark),
          perSubjectMin: Number(thresholds.overall.per_subject_min),
          mustPassEverySubject: thresholds.overall.must_pass_every_subject,
        }
      } else {
        config.value = { ...defaultConfig }
      }
    } catch (e) {
      console.error('Failed to load exam configuration:', e)
      error.value = 'Failed to load configuration'
      config.value = { ...defaultConfig }
    } finally {
      loading.value = false
    }
  }

  /**
   * Validate the configuration
   */
  function validateConfiguration(cfg: ExamConfig): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    // Validate overallPassMark
    if (cfg.overallPassMark < 0 || cfg.overallPassMark > 100) {
      errors.overallPassMark = 'Overall pass mark must be between 0 and 100'
    }

    // Validate perSubjectMin
    if (cfg.perSubjectMin < 0 || cfg.perSubjectMin > 100) {
      errors.perSubjectMin = 'Per-subject minimum must be between 0 and 100'
    }

    // Validate that perSubjectMin is not greater than overallPassMark
    if (cfg.perSubjectMin > cfg.overallPassMark) {
      errors.perSubjectMin = 'Per-subject minimum cannot be greater than overall pass mark'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Save configuration to API
   */
  async function saveConfiguration(cfg: ExamConfig): Promise<{ success: boolean; errors?: Record<string, string> }> {
    if (!campaignIdRef.value) {
      console.warn('No campaign selected, cannot save configuration')
      return { success: false, errors: { general: 'No campaign selected' } }
    }

    const validation = validateConfiguration(cfg)
    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }

    try {
      isSaving.value = true
      error.value = null

      await examThresholdService.saveOverallThreshold(campaignIdRef.value, {
        overall_pass_mark: cfg.overallPassMark,
        per_subject_min: cfg.perSubjectMin,
        must_pass_every_subject: cfg.mustPassEverySubject,
      })

      // Update reactive state
      config.value = { ...cfg }
      lastSaved.value = new Date()

      return { success: true }
    } catch (e: any) {
      console.error('Failed to save exam configuration:', e)
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to save configuration'
      error.value = errorMessage
      return { success: false, errors: { general: errorMessage } }
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Reset configuration to defaults
   */
  function resetConfiguration(): void {
    config.value = { ...defaultConfig }
    lastSaved.value = null
    error.value = null
  }

  /**
   * Get formatted last saved time
   */
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
