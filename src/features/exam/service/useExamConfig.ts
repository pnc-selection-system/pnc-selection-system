import { ref, computed } from 'vue'

export interface ExamConfig {
  overallPassMark: number
  perSubjectMin: number
  mustPassEverySubject: boolean
}

const STORAGE_KEY = 'exam-configuration'

const defaultConfig: ExamConfig = {
  overallPassMark: 60,
  perSubjectMin: 40,
  mustPassEverySubject: false,
}

function loadFromStorage(): ExamConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        overallPassMark: Number(parsed.overallPassMark) || defaultConfig.overallPassMark,
        perSubjectMin: Number(parsed.perSubjectMin) || defaultConfig.perSubjectMin,
        mustPassEverySubject: Boolean(parsed.mustPassEverySubject),
      }
    }
  } catch (e) {
    console.error('Failed to load exam configuration:', e)
  }
  return { ...defaultConfig }
}

const config = ref<ExamConfig>(loadFromStorage())
const isSaving = ref(false)
const lastSaved = ref<Date | null>(null)

export const defaultExamConfig: ExamConfig = { ...defaultConfig }

export function useExamConfig() {
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
   * Save configuration to localStorage
   */
  function saveConfiguration(cfg: ExamConfig): { success: boolean; errors?: Record<string, string> } {
    const validation = validateConfiguration(cfg)
    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }

    try {
      isSaving.value = true
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
      
      // Update reactive state
      config.value = { ...cfg }
      lastSaved.value = new Date()
      
      return { success: true }
    } catch (e) {
      console.error('Failed to save exam configuration:', e)
      return { success: false, errors: { general: 'Failed to save configuration' } }
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Reset configuration to defaults
   */
  function resetConfiguration(): void {
    config.value = { ...defaultConfig }
    localStorage.removeItem(STORAGE_KEY)
    lastSaved.value = null
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
    saveConfiguration,
    resetConfiguration,
    validateConfiguration,
  }
}
