export type SystemField = 'Student ID' | 'Candidate ID' | 'Raw Score' | 'Raw Correct' | 'Raw Wrong' | 'Unanswered' | 'Deduction' | 'Ignore'

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
  subjectRules?: SubjectRule[]
}

export interface CommitSummary {
  imported: number
  skipped: number
  campaign: string
  errors?: string[]
}

/** Represents a subject loaded from exam configuration */
export interface SubjectOption {
  id: number
  name: string
  maxScore: number
  weight: number
}

/** A rule applied during scoring */
export interface SubjectRule {
  name: string
  desc: string
  sign: '+' | '-'
  value: number
}

/** Preview row from parsed file with validation */
export interface PreviewRow {
  row: number
  student_id: string
  candidate_id: string
  raw_score: number | string
  raw_correct: number | null
  raw_wrong: number | null
  deduction: number | null
  preview_score: number | null
  valid: boolean
  errors: string[]
}

/** Response from the upload endpoint */
export interface UploadResponse {
  import_file_id: number
  file_name: string
  total_rows: number
  valid_rows: number
  preview: PreviewRow[]
  errors: string[]
  detected_columns: string[]
  auto_mapping: Record<string, string>
  subject_rules: SubjectRule[]
}
