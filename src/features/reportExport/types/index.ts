export enum ReportType {
  FinalSelectedList = 'final-selected-list',
  ExamResults = 'exam-results',
  InvestigationSummary = 'investigation-summary',
  VotingRecord = 'voting-record',
}

export enum ReportFormat {
  XLSX = 'xlsx',
  PDF = 'pdf',
}

export enum ReportStatus {
  Processing = 'processing',
  Ready = 'ready',
  Failed = 'failed',
}

export interface Report {
  id: string
  name: string
  type: ReportType
  format: ReportFormat
  status: ReportStatus
  progress?: number
  downloadUrl?: string
  campaign: string
  createdAt: string
  completedAt?: string
}

export interface GenerateReportPayload {
  type: ReportType
  format: ReportFormat
  campaign: string
}

export interface ReportApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const reportTypeLabels: Record<ReportType, string> = {
  [ReportType.FinalSelectedList]: 'Final selected list',
  [ReportType.ExamResults]: 'Exam results',
  [ReportType.InvestigationSummary]: 'Investigation summary',
  [ReportType.VotingRecord]: 'Voting record',
}

export const reportFormatLabels: Record<ReportFormat, string> = {
  [ReportFormat.XLSX]: 'Excel (.xlsx)',
  [ReportFormat.PDF]: 'PDF (.pdf)',
}

export const reportStatusLabels: Record<ReportStatus, string> = {
  [ReportStatus.Processing]: 'Processing',
  [ReportStatus.Ready]: 'Ready',
  [ReportStatus.Failed]: 'Failed',
}
