import api from '@/plugins/axios'
import type { CandidateResultRow } from '../types/candidate'
import type { ExamRound, PageMeta, ScoreDistribution, SummaryStats } from '../types/results'

export async function fetchPageMeta(): Promise<PageMeta> {
  return {
    breadcrumb: ['Exam', 'Results & Analytics'],
    title: 'Results & analytics',
    roles: [
      { role: 'Officer', action: 'view' },
      { role: 'Manager', action: 'publish' },
    ],
    reqRange: ['FR-EX-7', 'FR-EX-11'],
  }
}

/**
 * Fetch exam rounds (campaigns) that have results.
 */
export async function fetchRounds(): Promise<ExamRound[]> {
  try {
    const response = await api.get('/exam-results/rounds')
    return response.data.data || []
  } catch (error: any) {
    console.error('Failed to fetch rounds:', error.response?.data || error.message)
    return []
  }
}

/**
 * Fetch provinces with candidates who have results.
 */
export async function fetchProvinces(campaignId: number): Promise<string[]> {
  try {
    const response = await api.get('/exam-results/provinces', {
      params: { campaign_id: campaignId },
    })
    return response.data.data || ['All provinces']
  } catch (error: any) {
    console.error('Failed to fetch provinces:', error.response?.data || error.message)
    return ['All provinces']
  }
}

/**
 * Fetch summary statistics for a campaign.
 */
export async function fetchSummary(campaignId: number): Promise<SummaryStats> {
  try {
    const response = await api.get('/exam-results/summary', {
      params: { campaign_id: campaignId },
    })
    const data = response.data.data
    return data || { satExam: 0, passed: 0, failed: 0, passRate: 0 }
  } catch (error: any) {
    console.error('Failed to fetch summary:', error.response?.data || error.message)
    return { satExam: 0, passed: 0, failed: 0, passRate: 0 }
  }
}

/**
 * Fetch score distribution for a campaign, optionally filtered by province.
 */
export async function fetchScoreDistribution(
  campaignId: number,
  province: string,
): Promise<ScoreDistribution> {
  try {
    const response = await api.get('/exam-results/distribution', {
      params: {
        campaign_id: campaignId,
        province: province,
      },
    })
    const data = response.data.data
    return (
      data || {
        buckets: [],
        avg: 0,
        median: 0,
        passLine: 0,
      }
    )
  } catch (error: any) {
    console.error('Failed to fetch distribution:', error.response?.data || error.message)
    return { buckets: [], avg: 0, median: 0, passLine: 0 }
  }
}

/**
 * Fetch candidate results table for a campaign.
 */
export async function fetchResultsTable(campaignId: number): Promise<CandidateResultRow[]> {
  try {
    const response = await api.get('/exam-results/table', {
      params: { campaign_id: campaignId },
    })
    return response.data.data || []
  } catch (error: any) {
    console.error('Failed to fetch results table:', error.response?.data || error.message)
    return []
  }
}

export async function exportResults(
  roundId: string,
  rows: CandidateResultRow[],
): Promise<void> {
  // Generate CSV content from results
  const csvContent = generateCSV(rows)

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `results-round-${roundId}-${new Date().toISOString().split('T')[0]}.csv`,
  )
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function generateCSV(data: CandidateResultRow[]): string {
  if (data.length === 0) return ''

  // Build dynamic headers from scores keys
  const firstRow = data[0]
  const subjectKeys = Object.keys(firstRow.scores)
  const headers = ['Rank', 'Candidate', ...subjectKeys, 'Total', 'Result']

  const csvRows = [headers.join(',')]

  data.forEach((row) => {
    const values = [
      row.rank,
      `"${row.candidate}"`,
      ...subjectKeys.map((key) =>
        row.scores[key] !== null && row.scores[key] !== undefined
          ? (row.scores[key] as number).toFixed(1)
          : '',
      ),
      row.total.toFixed(1),
      row.result,
    ]
    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}

export async function publishAndLockRound(roundId: string): Promise<void> {
  // Intentionally left as no-op for now
  // Publishing/locking will be implemented when the workflow is ready
}
