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
  },
])

const searchQuery = ref('')
const provinceFilter = ref<string>('all')
const ngoFilter = ref<string>('all')
const statusFilter = ref<CandidateStatus | 'all'>('all')
const examResultFilter = ref<string>('all')
const showDuplicatesOnly = ref(false)
const selectedIds = ref<string[]>([])
const currentPage = ref(1)
const pageSize = 50

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

export function useCandidateList() {
  function addCandidate(candidate: Omit<Candidate, 'id'>) {
    const newId = String(candidates.value.length + 1)
    const nextCode = `C-${1041 + candidates.value.length + 1}`
    candidates.value.unshift({ ...candidate, id: newId, candidateCode: nextCode })
  }

  function importCandidates(newCandidates: Omit<Candidate, 'id'>[]) {
    newCandidates.forEach((c, idx) => {
      const newId = String(candidates.value.length + idx + 1)
      const nextCode = `C-${1041 + candidates.value.length + idx + 1}`
      candidates.value.unshift({ ...c, id: newId, candidateCode: nextCode })
    })
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

  function saveSegment(name: string) {
    const segment = {
      name,
      filters: {
        searchQuery: searchQuery.value,
        provinceFilter: provinceFilter.value,
        ngoFilter: ngoFilter.value,
        statusFilter: statusFilter.value,
        examResultFilter: examResultFilter.value,
        showDuplicatesOnly: showDuplicatesOnly.value,
      },
      candidateCount: filteredCandidates.value.length,
      savedAt: new Date().toISOString(),
    }
    const segments = JSON.parse(localStorage.getItem('candidateSegments') || '[]')
    segments.push(segment)
    localStorage.setItem('candidateSegments', JSON.stringify(segments))
    return segment
  }

  function exportCandidates(format: 'csv' | 'json' = 'csv') {
    const data = filteredCandidates.value
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      downloadBlob(blob, 'candidates.json')
    } else {
      const headers = ['ID', 'Code', 'Full Name', 'Gender', 'DOB', 'Age', 'Phone', 'Province', 'Address', 'Status', 'Organization', 'Exam Result', 'Exam Score']
      const rows = data.map(c => [
        c.id, c.candidateCode, c.fullName, c.gender, c.dateOfBirth, c.age, c.phone, c.province, c.address, c.status, c.organization || '', c.examResult || '', c.examScore ?? '',
      ])
      const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, 'candidates.csv')
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    candidates,
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
    pageSize,
    provinces,
    ngos,
    addCandidate,
    importCandidates,
    toggleSelectAll,
    toggleSelect,
    applyFilters,
    goToPage,
    resetFilters,
    saveSegment,
    exportCandidates,
  }
}
