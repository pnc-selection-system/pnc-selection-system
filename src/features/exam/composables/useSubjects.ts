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
  function addSubject(subject: Omit<Subject, 'id'>) {
    subjects.value.push({ ...subject, id: crypto.randomUUID() })
  }

  function updateSubject(updated: Subject) {
    const idx = subjects.value.findIndex((s) => s.id === updated.id)
    if (idx !== -1) {
      subjects.value[idx] = { ...updated }
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
  }
}
