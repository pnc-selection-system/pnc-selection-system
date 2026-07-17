import { ref, computed } from 'vue'
import type { Exam } from '../types'

const exams = ref<Exam[]>([
  {
    id: '1',
    name: 'Midterm Exam - Computer Science',
    campaignId: '1',
    campaignName: 'BEM Chairman Election 2025',
    description: 'Midterm examination for computer science department',
    status: 'active',
  },
  {
    id: '2',
    name: 'Final Exam - Mathematics',
    campaignId: '1',
    campaignName: 'BEM Chairman Election 2025',
    description: 'Final examination for mathematics department',
    status: 'draft',
  },
  {
    id: '3',
    name: 'Quiz - Data Structures',
    campaignId: '2',
    campaignName: 'Department Association Election 2025',
    description: 'Quiz on data structures and algorithms',
    status: 'closed',
  },
  {
    id: '4',
    name: 'Midterm Exam - Physics',
    campaignId: '2',
    campaignName: 'Department Association Election 2025',
    description: 'Midterm examination for physics department',
    status: 'draft',
  },
])

const campaignFilter = ref<string>('all')
const statusFilter = ref<string>('all')
const showInfoBox = ref(true)

const campaigns = computed(() => {
  const campaignMap = new Map<string, string>()
  exams.value.forEach((exam) => {
    if (!campaignMap.has(exam.campaignId)) {
      campaignMap.set(exam.campaignId, exam.campaignName)
    }
  })
  return Array.from(campaignMap.entries()).map(([id, name]) => ({ id, name }))
})

const filteredExams = computed(() => {
  return exams.value.filter((e) => {
    const matchesCampaign = campaignFilter.value === 'all' || e.campaignId === campaignFilter.value
    const matchesStatus = statusFilter.value === 'all' || e.status === statusFilter.value
    return matchesCampaign && matchesStatus
  })
})

export function useExams() {
  function deleteExam(id: string) {
    exams.value = exams.value.filter((e) => e.id !== id)
  }

  function updateExam(updated: Exam) {
    const idx = exams.value.findIndex((e) => e.id === updated.id)
    if (idx !== -1) {
      exams.value[idx] = { ...updated }
    }
  }

  function addExam(exam: Exam) {
    exams.value.unshift({ ...exam })
  }

  function getStatusCount(status: Exam['status'] | 'all') {
    if (status === 'all') return exams.value.length
    return exams.value.filter((e) => e.status === status).length
  }

  function dismissInfoBox() {
    showInfoBox.value = false
  }

  return {
    exams,
    campaignFilter,
    statusFilter,
    showInfoBox,
    campaigns,
    filteredExams,
    deleteExam,
    updateExam,
    addExam,
    getStatusCount,
    dismissInfoBox,
  }
}
