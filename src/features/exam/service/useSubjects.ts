import { ref, computed } from 'vue'

export interface Subject {
  id: string
  name: string
  maxScore: number
  weight: number
  deductionRule: string
}

const subjects = ref<Subject[]>([
  { id: '1', name: 'Mathematics', maxScore: 100, weight: 40, deductionRule: '-0.25 / wrong' },
  { id: '2', name: 'Khmer', maxScore: 100, weight: 25, deductionRule: 'none' },
  { id: '3', name: 'English', maxScore: 100, weight: 20, deductionRule: 'none' },
  { id: '4', name: 'Logic', maxScore: 50, weight: 15, deductionRule: '-0.5 / wrong' },
])

const totalWeight = computed(() => subjects.value.reduce((sum, s) => sum + s.weight, 0))
const isValidWeight = computed(() => totalWeight.value === 100)

export function useSubjects() {
  /**
   * Check if a subject name already exists (case-insensitive)
   */
  function isDuplicateName(name: string, excludeId?: string): boolean {
    const trimmedName = name.trim().toLowerCase()
    return subjects.value.some(
      (s) => s.id !== excludeId && s.name.toLowerCase() === trimmedName
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
      errors
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
      errors
    }
  }

  function addSubject(subject: Omit<Subject, 'id'>) {
    const validation = validateSubject(subject)
    if (!validation.valid) {
      throw new Error(Object.values(validation.errors)[0])
    }
    subjects.value.push({ ...subject, id: crypto.randomUUID(), name: subject.name.trim() })
  }

  function updateSubject(updated: Subject) {
    const validation = validateSubjectUpdate(updated)
    if (!validation.valid) {
      throw new Error(Object.values(validation.errors)[0])
    }
    const idx = subjects.value.findIndex((s) => s.id === updated.id)
    if (idx !== -1) {
      subjects.value[idx] = { ...updated, name: updated.name.trim() }
    }
  }

  function removeSubject(id: string) {
    subjects.value = subjects.value.filter((s) => s.id !== id)
  }

  return {
    subjects,
    totalWeight,
    isValidWeight,
    addSubject,
    updateSubject,
    removeSubject,
    isDuplicateName,
    isValidName,
    validateSubject,
    validateSubjectUpdate,
  }
}
