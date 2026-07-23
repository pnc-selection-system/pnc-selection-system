import { computed, reactive, ref } from 'vue'
import type { SessionFormData } from '../types/session'

export function useSessionFormValidation(modelValue: () => SessionFormData) {
  // --- Track which fields the user has interacted with ---
  const touched = reactive<Record<string, boolean>>({
    date: false,
    school: false,
    venue: false,
    expectedAttendance: false,
    attendanceCount: false,
    partnerType: false,
    partnerName: false,
    location: false,
    department: false,
    generation: false,
  })
  const wasSubmitted = ref(false)

  function markTouched(field: string) {
    touched[field] = true
  }

  function markAllTouched() {
    Object.keys(touched).forEach(k => { touched[k] = true })
  }

  // --- Validation logic ---
  function validateSessionForm(): Record<string, string> {
    const errs: Record<string, string> = {}
    const d = modelValue()

    // date
    if (!d.date?.trim()) {
      errs.date = 'Session date is required'
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) {
      errs.date = 'Invalid date format'
    } else {
      // Only enforce past-date check for new sessions, not when editing existing ones
      if (!d.id) {
        const today = new Date()
        const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        if (d.date < localDate) {
          errs.date = 'Date cannot be in the past'
        }
      }
    }

    // school — required for Alumni partner type
    if (d.partnerType === 'Alumni') {
      if (!d.school?.trim()) {
        errs.school = 'School name is required'
      } else if (d.school.trim().length > 150) {
        errs.school = 'School name must be 150 characters or less'
      }
    }

    // venue (optional, max length check)
    if (d.venue?.trim() && d.venue.trim().length > 200) {
      errs.venue = 'Venue name must be 200 characters or less'
    }

    // expectedAttendance
    const expected = Number(d.expectedAttendance)
    if (!d.expectedAttendance || expected < 1) {
      errs.expectedAttendance = 'Must be at least 1'
    } else if (!Number.isInteger(expected)) {
      errs.expectedAttendance = 'Must be a whole number'
    }

    // attendanceCount
    const attendance = Number(d.attendanceCount)
    if (attendance < 0) {
      errs.attendanceCount = 'Cannot be negative'
    } else if (!Number.isInteger(attendance)) {
      errs.attendanceCount = 'Must be a whole number'
    }

    // Partner type must be selected
    if (!d.partnerType) {
      errs.partnerType = 'Please select a partner type'
    }

    // Partner-type-specific validations
    if (d.partnerType === 'School') {
      // School: needs a school partner name
      if (!d.partnerName?.trim()) {
        errs.partnerName = 'School partner name is required'
      } else if (d.partnerName.trim().length > 150) {
        errs.partnerName = 'School partner name must be 150 characters or less'
      }
    } else if (d.partnerType === 'Alumni') {
      // Alumni: needs a name and location
      if (!d.partnerName?.trim()) {
        errs.partnerName = 'Alumni name is required'
      } else if (d.partnerName.trim().length > 150) {
        errs.partnerName = 'Alumni name must be 150 characters or less'
      }
      if (!d.location?.trim()) {
        errs.location = 'Location is required'
      }
      if (!d.generation?.trim()) {
        errs.generation = 'Generation is required'
      } else if (d.generation.trim().length > 100) {
        errs.generation = 'Generation must be 100 characters or less'
      }
    } else if (d.partnerType === 'NGO') {
      // NGO: needs an NGO partner selected
      if (!d.partnerName?.trim()) {
        errs.partnerName = 'Please select an NGO partner'
      }
    } else if (d.partnerType === 'Officer') {
      // Officer: needs at least one officer name (input or added via host list)
      const hasOfficerNames = d.partnerName?.trim() || d.hosts.length > 0
      if (!hasOfficerNames) {
        errs.partnerName = 'At least one officer name is required'
      } else if (d.partnerName?.trim() && d.partnerName.trim().length > 150) {
        errs.partnerName = 'Officer name must be 150 characters or less'
      }
      if (!d.department?.trim()) {
        errs.department = 'Department is required'
      } else if (d.department.trim().length > 150) {
        errs.department = 'Department must be 150 characters or less'
      }
    }

    return errs
  }

  const validationErrors = computed(() => validateSessionForm())

  const visibleErrors = computed<Record<string, string>>(() => {
    if (wasSubmitted.value) return validationErrors.value
    const errs: Record<string, string> = {}
    const all = validationErrors.value
    for (const key of Object.keys(all)) {
      if (touched[key]) {
        errs[key] = all[key]
      }
    }
    return errs
  })

  const isFormValid = computed(() => Object.keys(validationErrors.value).length === 0)
  const errorCount = computed(() => Object.keys(validationErrors.value).length)

  // --- Helper to get error for a field ---
  function fieldError(field: string): string | undefined {
    return visibleErrors.value[field]
  }

  function hasError(field: string): boolean {
    return !!visibleErrors.value[field]
  }

  const inputClassBase = 'w-full rounded border bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:ring-2'
  const normalInputClass = 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'
  const errorInputClass = 'border-red-400 focus:border-red-500 focus:ring-red-100'

  function inputClasses(field: string): string {
    const state = hasError(field) ? errorInputClass : normalInputClass
    return `${inputClassBase} ${state}`
  }

  return {
    touched,
    wasSubmitted,
    markTouched,
    markAllTouched,
    validationErrors,
    visibleErrors,
    isFormValid,
    errorCount,
    fieldError,
    hasError,
    inputClasses,
  }
}
