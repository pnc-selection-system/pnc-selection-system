import { ref, computed, watch, unref } from 'vue'
import type { ExamSubjectApiData } from '../types'
import * as examSubjectService from './examSubjectService'
import { useCacheFetch } from '@/composables/useCacheFetch'

export interface Subject {
  id: number
  name: string
  maxScore: number
  weight: number
}

export interface UseSubjectsOptions {
  campaignId?: number | null
}

export function useSubjects(options?: UseSubjectsOptions) {
  const currentCampaignId = ref(options?.campaignId ?? null)
  const subjects = ref<Subject[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ---- Cache-backed fetch (reactive key — auto re-fetches on campaign switch) ----
  const {
    data: cachedData,
    loading: cacheLoading,
    error: cacheError,
    refresh: loadSubjects,
  } = useCacheFetch<Subject[]>(
    () => (unref(currentCampaignId) ? `exam-subjects:${unref(currentCampaignId)}` : ''),
    async () => {
      const apiData = await examSubjectService.fetchSubjects(unref(currentCampaignId) ?? undefined)
      return apiData.map(mapApiToSubject)
    },
    { ttl: 30_000 },
  )

  // Sync cache data into the local mutable ref (useCacheFetch returns readonly refs)
  watch(cachedData, (val) => {
    subjects.value = val ?? []
  }, { immediate: true })

  watch(cacheLoading, (val) => { loading.value = val }, { immediate: true })
  watch(cacheError, (val) => { error.value = val }, { immediate: true })

  const totalWeight = computed(() => subjects.value.reduce((sum, s) => sum + s.weight, 0))
  const isValidWeight = computed(() => totalWeight.value === 100)

  /**
   * Check if a subject name already exists (case-insensitive)
   */
  function isDuplicateName(name: string, excludeId?: number): boolean {
    const trimmedName = name.trim().toLowerCase()
    return subjects.value.some(
      (s) => s.id !== excludeId && s.name.toLowerCase() === trimmedName,
    )
  }

  /**
   * Validate that subject name is a valid string (non-empty, alphanumeric with spaces)
   */
  function isValidName(name: string): { valid: boolean; error?: string } {
    const trimmed = name.trim()

    if (!trimmed) {
      return { valid: false, error: 'Subject name is required' }
    }

    if (typeof trimmed !== 'string') {
      return { valid: false, error: 'Subject name must be a string' }
    }

    // Only allow letters, spaces, and common characters (no numbers/digits)
    const nameRegex = /^[a-zA-Z\s\-_&]+$/
    if (!nameRegex.test(trimmed)) {
      return { valid: false, error: 'Subject name can only contain letters, spaces, hyphens, and underscores (no numbers)' }
    }

    if (trimmed.length < 2) {
      return { valid: false, error: 'Subject name must be at least 2 characters' }
    }

    if (trimmed.length > 50) {
      return { valid: false, error: 'Subject name must be less than 50 characters' }
    }

    return { valid: true }
  }

  /**
   * Validate a new subject before adding
   */
  function validateSubject(subject: Omit<Subject, 'id'>): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    // Validate name
    const nameValidation = isValidName(subject.name)
    if (!nameValidation.valid) {
      errors.name = nameValidation.error!
    }

    // Check for duplicate name
    if (nameValidation.valid && isDuplicateName(subject.name)) {
      errors.name = 'A subject with this name already exists'
    }

    // Validate maxScore
    if (!subject.maxScore || subject.maxScore <= 0) {
      errors.maxScore = 'Max score must be greater than 0'
    }

    // Validate weight
    if (subject.weight < 0 || subject.weight > 100) {
      errors.weight = 'Weight must be between 0 and 100'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  /**
   * Validate an updated subject (excluding current ID from duplicate check)
   */
  function validateSubjectUpdate(subject: Subject): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    // Validate name
    const nameValidation = isValidName(subject.name)
    if (!nameValidation.valid) {
      errors.name = nameValidation.error!
    }

    // Check for duplicate name (excluding current subject)
    if (nameValidation.valid && isDuplicateName(subject.name, subject.id)) {
      errors.name = 'A subject with this name already exists'
    }

    // Validate maxScore
    if (!subject.maxScore || subject.maxScore <= 0) {
      errors.maxScore = 'Max score must be greater than 0'
    }

    // Validate weight
    if (subject.weight < 0 || subject.weight > 100) {
      errors.weight = 'Weight must be between 0 and 100'
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    }
  }

  async function addSubject(subject: Omit<Subject, 'id'>): Promise<void> {
    const validation = validateSubject(subject)
    if (!validation.valid) {
      throw new Error(Object.values(validation.errors)[0])
    }

    if (!currentCampaignId.value) {
      throw new Error('No campaign selected')
    }

    try {
      const created = await examSubjectService.createSubject({
        campaign_id: currentCampaignId.value,
        name: subject.name.trim(),
        max_score: subject.maxScore,
        weight: subject.weight,
      })
      subjects.value.push(mapApiToSubject(created))
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create subject'
      throw new Error(message)
    }
  }

  async function updateSubject(updated: Subject): Promise<void> {
    const validation = validateSubjectUpdate(updated)
    if (!validation.valid) {
      throw new Error(Object.values(validation.errors)[0])
    }

    try {
      const result = await examSubjectService.updateSubject(updated.id, {
        name: updated.name.trim(),
        max_score: updated.maxScore,
        weight: updated.weight,
      })
      const idx = subjects.value.findIndex((s) => s.id === updated.id)
      if (idx !== -1) {
        subjects.value[idx] = mapApiToSubject(result)
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update subject'
      throw new Error(message)
    }
  }

  async function removeSubject(id: number): Promise<void> {
    try {
      await examSubjectService.deleteSubject(id)
      subjects.value = subjects.value.filter((s) => s.id !== id)
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete subject'
      throw new Error(message)
    }
  }

  function setCampaignId(campaignId: number | null) {
    currentCampaignId.value = campaignId
  }

  return {
    subjects,
    totalWeight,
    isValidWeight,
    loading,
    error,
    loadSubjects,
    addSubject,
    updateSubject,
    removeSubject,
    isDuplicateName,
    isValidName,
    validateSubject,
    validateSubjectUpdate,
    setCampaignId,
    currentCampaignId,
  }
}

/**
 * Map API snake_case data to frontend camelCase Subject
 */
function mapApiToSubject(apiSubject: ExamSubjectApiData): Subject {
  return {
    id: apiSubject.id,
    name: apiSubject.name,
    maxScore: Number(apiSubject.max_score),
    weight: Number(apiSubject.weight),
  }
}
