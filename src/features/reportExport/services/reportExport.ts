import api from '@/plugins/axios'
import type { Report, GenerateReportPayload, ReportApiResponse } from '../types'

// Mock data for development
let mockReports: Report[] = [
  {
    id: '1',
    name: 'Final selected list',
    type: 'final-selected-list' as any,
    format: 'xlsx' as any,
    status: 'processing' as any,
    progress: 60,
    campaign: '2026',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Exam results — Round 1',
    type: 'exam-results' as any,
    format: 'xlsx' as any,
    status: 'ready' as any,
    downloadUrl: '#',
    campaign: '2026',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Investigation summary',
    type: 'investigation-summary' as any,
    format: 'pdf' as any,
    status: 'ready' as any,
    downloadUrl: '#',
    campaign: '2026',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Voting record',
    type: 'voting-record' as any,
    format: 'pdf' as any,
    status: 'ready' as any,
    downloadUrl: '#',
    campaign: '2026',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
]

export async function fetchReports(): Promise<Report[]> {
  try {
    const { data } = await api.get<ReportApiResponse<Report[]>>('/reports')
    return data.data
  } catch {
    // Return mock data if API is not available
    return mockReports
  }
}

export async function generateReport(payload: GenerateReportPayload): Promise<Report> {
  try {
    const { data } = await api.post<ReportApiResponse<Report>>('/reports', payload)
    return data.data
  } catch {
    // Mock report generation
    const newReport: Report = {
      id: String(mockReports.length + 1),
      name: getReportName(payload.type),
      type: payload.type,
      format: payload.format,
      status: 'processing' as any,
      progress: 0,
      campaign: payload.campaign,
      createdAt: new Date().toISOString(),
    }
    mockReports = [newReport, ...mockReports]
    return newReport
  }
}

function getMimeType(format: string): string {
  switch (format) {
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'pdf':
      return 'application/pdf'
    default:
      return 'application/octet-stream'
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function getReportInfo(id: string): { name: string; format: string } {
  const report = mockReports.find((r) => r.id === id)
  return report
    ? { name: report.name, format: report.format }
    : { name: `report-${id}`, format: 'xlsx' }
}

export async function downloadReport(id: string): Promise<void> {
  try {
    const { name, format } = getReportInfo(id)
    const response = await api.get(`/reports/${id}/download`, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: getMimeType(format) })
    triggerDownload(blob, `${name}.${format}`)
  } catch {
    // Mock download - create a sample file
    const { name, format } = getReportInfo(id)
    const content = `Mock ${format.toUpperCase()} file for ${name}`
    const blob = new Blob([content], { type: getMimeType(format) })
    triggerDownload(blob, `${name}.${format}`)
  }
}

export async function getReportStatus(id: string): Promise<Report> {
  try {
    const { data } = await api.get<ReportApiResponse<Report>>(`/reports/${id}`)
    return data.data
  } catch {
    const report = mockReports.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    return report
  }
}

function getReportName(type: string): string {
  const names: Record<string, string> = {
    'final-selected-list': 'Final selected list',
    'exam-results': 'Exam results',
    'investigation-summary': 'Investigation summary',
    'voting-record': 'Voting record',
  }
  return names[type] || 'Report'
}
