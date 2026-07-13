import { ref, computed } from 'vue'
import type { Candidate, CandidateStatus } from '../types/index'

const candidates = ref<Candidate[]>([
  {
    id: '1',
    candidateCode: 'C-1042',
    fullName: 'Sokha Norng',
    gender: 'F',
    dateOfBirth: '2008-09-04',
    age: 17,
    phone: '+855 12 345 678',
    province: 'Battambang',
    address: 'Village, commune, district...',
    status: 'investigating',
    organization: 'Future Light',
    roles: ['Officer', 'Manager'],
    requirements: ['FR-CP-6', 'FR-CP-7', 'FR-CP-8'],
    isDuplicate: true,
    examResult: 'pass',
    examScore: 78,
    educationLevel: 'High School',
    schoolName: 'Battambang High School',
    major: 'General Science',
    graduationYear: '2026',
    gpa: '3.8',
    familySize: 5,
    monthlyIncome: '$200',
    occupation: 'Farmer',
    housingType: 'House',
    hasDisability: false,
    interviewScore: 85,
    evaluatedBy: 'Mr. Vuthy',
    evaluationDate: '2025-06-15',
    evaluationNotes: 'Strong candidate with good communication skills.',
  },
  {
    id: '2',
    candidateCode: 'C-1043',
    fullName: 'Dara Kem',
    gender: 'M',
    dateOfBirth: '2007-03-15',
    age: 18,
    phone: '+855 98 765 432',
    province: 'Siem Reap',
    address: 'Sangkat Sivatha, Siem Reap',
    status: 'assessed',
    organization: '',
    roles: ['Officer'],
    requirements: ['FR-CP-6', 'FR-CP-7'],
    isDuplicate: false,
    examResult: 'pass',
    examScore: 71,
    educationLevel: 'High School',
    schoolName: 'Siem Reap High School',
    major: 'General Science',
    graduationYear: '2025',
    gpa: '3.5',
    familySize: 4,
    monthlyIncome: '$300',
    occupation: 'Teacher',
    housingType: 'Apartment',
    hasDisability: false,
    interviewScore: 80,
    evaluatedBy: 'Ms. Sophea',
    evaluationDate: '2025-06-10',
    evaluationNotes: 'Excellent leadership qualities.',
  },
  {
    id: '3',
    candidateCode: 'C-1044',
    fullName: 'Mealea Phan',
    gender: 'F',
    dateOfBirth: '2006-11-20',
    age: 18,
    phone: '+855 77 888 999',
    province: 'Phnom Penh',
    address: 'Sangkat Toul Tompong, Khan Chamkarmon',
    status: 'exam_done',
    organization: 'Hope',
    roles: ['Manager'],
    requirements: ['FR-CP-6', 'FR-CP-8'],
    isDuplicate: false,
    examResult: 'fail',
    examScore: 44,
    educationLevel: 'High School',
    schoolName: 'Phnom Penh High School',
    major: 'General Science',
    graduationYear: '2025',
    gpa: '3.2',
    familySize: 6,
    monthlyIncome: '$150',
    occupation: 'Student',
    housingType: 'House',
    hasDisability: false,
  },
  {
    id: '4',
    candidateCode: 'C-1045',
    fullName: 'Vibol Som',
    gender: 'M',
    dateOfBirth: '2008-01-10',
    age: 17,
    phone: '+855 66 555 444',
    province: 'Kampong Cham',
    address: 'Sangkat Kampong Cham',
    status: 'registered',
    organization: 'Rural Reach',
    roles: ['Officer'],
    requirements: ['FR-CP-6'],
    isDuplicate: false,
    examResult: null,
    examScore: undefined,
    educationLevel: 'High School',
    schoolName: 'Kampong Cham High School',
    major: 'General Science',
    graduationYear: '2026',
    gpa: '3.6',
    familySize: 5,
    monthlyIncome: '$180',
    occupation: 'Student',
    housingType: 'House',
    hasDisability: false,
  },
])

const selectedCandidateId = ref<string | null>(null)
const searchQuery = ref('')
const provinceFilter = ref<string>('all')
const ngoFilter = ref<string>('all')
const statusFilter = ref<CandidateStatus | 'all'>('all')
const examResultFilter = ref<string>('all')
const showDuplicatesOnly = ref(false)
const selectedIds = ref<string[]>([])
const currentPage = ref(1)
const pageSize = 50

const selectedCandidate = computed(() => {
  if (!selectedCandidateId.value) return candidates.value[0] || null
  return candidates.value.find((c) => c.id === selectedCandidateId.value) || null
})

const provinces = computed(() => {
  const set = new Set(candidates.value.map((c) => c.province))
  return Array.from(set).sort()
})

const ngos = computed(() => {
  const set = new Set(candidates.value.filter((c) => c.organization).map((c) => c.organization))
  return Array.from(set).sort()
})

const filteredCandidates = computed(() => {
  return candidates.value.filter((c) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.candidateCode.toLowerCase().includes(q) ||
      c.schoolName?.toLowerCase().includes(q)
    const matchesProvince = provinceFilter.value === 'all' || c.province === provinceFilter.value
    const matchesNgo = ngoFilter.value === 'all' || c.organization === ngoFilter.value
    const matchesStatus = statusFilter.value === 'all' || c.status === statusFilter.value
    const matchesExam =
      examResultFilter.value === 'all' ||
      (examResultFilter.value === 'pass' && c.examResult === 'pass') ||
      (examResultFilter.value === 'fail' && c.examResult === 'fail') ||
      (examResultFilter.value === 'none' && c.examResult === null)
    const matchesDuplicate = !showDuplicatesOnly.value || c.isDuplicate
    return matchesSearch && matchesProvince && matchesNgo && matchesStatus && matchesExam && matchesDuplicate
  })
})

const totalPages = computed(() => Math.ceil(filteredCandidates.value.length / pageSize))

const paginatedCandidates = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCandidates.value.slice(start, start + pageSize)
})

export function useCandidateProfile() {
  function selectCandidate(id: string) {
    selectedCandidateId.value = id
  }

  function updateCandidateStatus(id: string, status: CandidateStatus) {
    const idx = candidates.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      candidates.value[idx] = { ...candidates.value[idx], status }
    }
  }

  function updateCandidatePhoto(id: string, photoUrl: string) {
    const idx = candidates.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      candidates.value[idx] = { ...candidates.value[idx], photoUrl }
    }
  }

  function getCandidateById(id: string) {
    return candidates.value.find((c) => c.id === id) || null
  }

  function toggleSelectAll() {
    if (selectedIds.value.length === paginatedCandidates.value.length) {
      selectedIds.value = []
    } else {
      selectedIds.value = paginatedCandidates.value.map((c) => c.id)
    }
  }

  function toggleSelect(id: string) {
    const idx = selectedIds.value.indexOf(id)
    if (idx === -1) {
      selectedIds.value.push(id)
    } else {
      selectedIds.value.splice(idx, 1)
    }
  }

  function applyFilters() {
    currentPage.value = 1
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function resetFilters() {
    searchQuery.value = ''
    provinceFilter.value = 'all'
    ngoFilter.value = 'all'
    statusFilter.value = 'all'
    examResultFilter.value = 'all'
    showDuplicatesOnly.value = false
    currentPage.value = 1
  }

  return {
    candidates,
    selectedCandidate,
    selectedCandidateId,
    filteredCandidates,
    paginatedCandidates,
    searchQuery,
    provinceFilter,
    ngoFilter,
    statusFilter,
    examResultFilter,
    showDuplicatesOnly,
    selectedIds,
    currentPage,
    totalPages,
    provinces,
    ngos,
    selectCandidate,
    updateCandidateStatus,
    updateCandidatePhoto,
    getCandidateById,
    toggleSelectAll,
    toggleSelect,
    applyFilters,
    goToPage,
    resetFilters,
  }
}
