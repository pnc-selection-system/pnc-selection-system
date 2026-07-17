import type { PageMeta } from '../types/wizard'
import type {
  ColumnMapping,
  CommitSummary,
  SystemField,
  UploadedFile,
  ValidationResult,
} from '../types/mapping'

const DELAY = 400

function wait<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const SYSTEM_FIELDS: SystemField[] = ['Candidate ID', 'Mathematics', 'Khmer', 'Ignore']

export async function fetchPageMeta(): Promise<PageMeta> {
  return wait({
    breadcrumb: ['Exam', 'Import Wizard'],
    title: 'Import exam results',
    roles: ['Officer', 'Manager'],
    reqCodes: ['FR-EX-5', 'FR-EX-6'],
    fileFormats: 'ZipGrade CSV/XLSX',
  })
}

/**
 * Simulates parsing the uploaded file's header row + a sample value per column,
 * with a best-guess mapping to system fields.
 */
export async function parseUploadedFile(file: File): Promise<{ file: UploadedFile; mappings: ColumnMapping[] }> {
  return wait({
    file: { name: file.name, rowCount: 128 },
    mappings: [
      { fileColumn: 'StudentID', sampleValue: 'C-1042', mappedTo: 'Candidate ID' },
      { fileColumn: 'Math_raw', sampleValue: '78', mappedTo: 'Mathematics' },
      { fileColumn: 'Khmer_raw', sampleValue: '71', mappedTo: 'Khmer' },
      { fileColumn: 'Notes', sampleValue: '—', mappedTo: 'Ignore' },
    ],
  })
}

export async function runValidation(mappings: ColumnMapping[]): Promise<ValidationResult> {
  return wait({
    totalRows: 128,
    validRows: 121,
    issues: [
      { row: 57, column: 'StudentID', message: 'Unmatched StudentID "C-9999"', type: 'error' },
      { row: 112, column: 'ID', message: 'Duplicate ID — keeps highest score', type: 'warning' },
      { row: 340, column: 'Math_raw', message: 'Math_raw "abc" not numeric', type: 'error' },
    ],
  })
}

export async function commitImport(): Promise<CommitSummary> {
  return wait({ imported: 121, skipped: 7, campaign: '2026' })
}