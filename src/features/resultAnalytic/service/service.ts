import type { CandidateResultRow } from '../types/candidate'
import type { ExamRound, PageMeta, ScoreDistribution, SummaryStats } from '../types/results'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Exam', 'Results & Analytics'],
    title: 'Results & analytics',
    roles: [
      { role: 'Officer', action: 'view' },
      { role: 'Manager', action: 'publish' },
    ],
    reqRange: ['FR-EX-7', 'FR-EX-11'],
  })
}

export async function fetchRounds(): Promise<ExamRound[]> {
  return wait([
    { id: 'r1', label: 'Round 1' },
    { id: 'r2', label: 'Round 2' },
  ])
}

export async function fetchProvinces(): Promise<string[]> {
  return wait(['All provinces', 'Phnom Penh', 'Battambang', 'Siem Reap', 'Kampong Cham'])
}

export async function fetchSummary(roundId: string): Promise<SummaryStats> {
  return wait({ satExam: 1201, passed: 762, failed: 439, passRate: 63 })
}

export async function fetchScoreDistribution(roundId: string, province: string): Promise<ScoreDistribution> {
  return wait({
    buckets: [
      { rangeLabel: '0-20', count: 18, isModal: false },
      { rangeLabel: '20-35', count: 34, isModal: false },
      { rangeLabel: '35-50', count: 58, isModal: false },
      { rangeLabel: '50-65', count: 96, isModal: true },
      { rangeLabel: '65-75', count: 82, isModal: false },
      { rangeLabel: '75-90', count: 47, isModal: false },
      { rangeLabel: '90-100', count: 22, isModal: false },
    ],
    avg: 64,
    median: 66,
    passLine: 60,
  })
}

export async function fetchResultsTable(roundId: string): Promise<CandidateResultRow[]> {
  return wait([
    { rank: 1, candidate: 'Pisey L.', scores: { math: 96, khmer: 91, eng: 88, logic: 47 }, total: 92.1, result: 'Pass' },
    { rank: 2, candidate: 'Rithy S.', scores: { math: 92, khmer: 89, eng: 90, logic: 44 }, total: 89.4, result: 'Pass' },
    { rank: 142, candidate: 'Sokha N.', scores: { math: 78, khmer: 71, eng: 80, logic: 30 }, total: 71.5, result: 'Pass' },
    { rank: 910, candidate: 'Mealea P.', scores: { math: 44, khmer: 52, eng: 40, logic: 18 }, total: 43.0, result: 'Fail' },
  ])
}

export async function exportResults(roundId: string, rows: CandidateResultRow[]): Promise<void> {
  await wait(undefined)
  // Generate CSV content from results
  const csvContent = generateCSV(rows)
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `results-round-${roundId}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function generateCSV(data: CandidateResultRow[]): string {
  // CSV Header
  const headers = ['Rank', 'Candidate', 'Mathematics', 'Khmer', 'English', 'Logic', 'Total', 'Result']
  
  const csvRows = [headers.join(',')]
  
  data.forEach(row => {
    const values = [
      row.rank,
      `"${row.candidate}"`,
      row.scores.math,
      row.scores.khmer,
      row.scores.eng,
      row.scores.logic,
      row.total,
      row.result
    ]
    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}

export async function publishAndLockRound(roundId: string): Promise<void> {
  await wait(undefined)
}