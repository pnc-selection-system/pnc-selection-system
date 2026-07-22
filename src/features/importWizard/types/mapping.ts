export type SystemField = 'Candidate ID' | 'Mathematics' | 'Khmer' | 'Ignore'

export interface ColumnMapping {
  fileColumn: string
  sampleValue: string
  mappedTo: SystemField
}

export interface UploadedFile {
  name: string
  rowCount: number
}

export interface ValidationIssue {
  row: number
  column: string
  message: string
  type: 'error' | 'warning'
}

export interface ValidationResult {
  totalRows: number
  validRows: number
  issues: ValidationIssue[]
}

export interface CommitSummary {
  imported: number
  skipped: number
  campaign: string
}