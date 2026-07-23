import api from '@/plugins/axios'
import type { PageMeta } from '../types/wizard'
import type {
  ColumnMapping,
  CommitSummary,
  SystemField,
  UploadedFile,
  ValidationResult,
  UploadResponse,
} from '../types/mapping'

export const SYSTEM_FIELDS: SystemField[] = [
  'Student ID',
  'Candidate ID',
  'Raw Score',
  'Raw Correct',
  'Raw Wrong',
  'Unanswered',
  'Deduction',
  'Ignore',
]

export async function fetchPageMeta(): Promise<PageMeta> {
  return {
    breadcrumb: ['Exam', 'Import Wizard'],
    title: 'Import exam results',
    roles: ['Officer', 'Manager'],
    reqCodes: ['FR-EX-5', 'FR-EX-6'],
    fileFormats: 'ZipGrade CSV/XLSX',
  }
}

/**
 * Parse the uploaded file's header row + a sample value per column,
 * with a best-guess mapping to system fields.
 * Also validates student_ids against the candidate list in preview.
 */
export async function parseUploadedFile(
  file: File,
  campaignId: number,
  subjectId: number
): Promise<{ file: UploadedFile; mappings: ColumnMapping[]; importFileId: number; subjectRules: any[] }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('campaign_id', String(campaignId))
  formData.append('subject_id', String(subjectId))

  try {
    const response = await api.post('/exam-results/import/upload', formData)
    const data: UploadResponse = response.data.data

    // Map detected columns to frontend format
    const mappings: ColumnMapping[] = data.detected_columns.map((col: string, index: number) => {
      // Find corresponding sample row's first value
      const sample = data.preview[0]
      const sampleValue = sample
        ? String((sample as any)[data.auto_mapping[col] || 'student_id'] || '')
        : ''

      return {
        fileColumn: col,
        sampleValue: sampleValue,
        mappedTo: data.auto_mapping[col] ? toDisplayField(data.auto_mapping[col]) : 'Ignore',
      }
    })

    return {
      file: { name: data.file_name, rowCount: data.total_rows },
      mappings,
      importFileId: data.import_file_id,
      subjectRules: data.subject_rules || [],
    }
  } catch (error: any) {
    console.error('Upload error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || error.message || 'Failed to upload file')
  }
}

/**
 * Convert backend db field name to display field name
 */
function toDisplayField(dbField: string): SystemField {
  const map: Record<string, SystemField> = {
    student_id: 'Student ID',
    candidate_id: 'Candidate ID',
    raw_score: 'Raw Score',
    raw_correct: 'Raw Correct',
    raw_wrong: 'Raw Wrong',
    raw_unanswered: 'Unanswered',
    deduction: 'Deduction',
  }
  return map[dbField] || 'Ignore'
}

/**
 * Run validation against the backend with the user's column mapping.
 * Checks student_id matches, score calculations, rule applications.
 */
export async function runValidation(
  mappings: ColumnMapping[],
  importFileId: number,
  subjectId: number
): Promise<ValidationResult> {
  // Convert frontend display fields to backend db fields
  const columnMapping: Record<string, string> = {}
  mappings.forEach((m, index) => {
    if (m.mappedTo !== 'Ignore') {
      const dbField = toBackendField(m.mappedTo)
      if (dbField) {
        columnMapping[String(index)] = dbField
      }
    }
  })

  try {
    const response = await api.post('/exam-results/import/validate', {
      import_file_id: importFileId,
      column_mapping: columnMapping,
      subject_id: subjectId,
    })

    const data = response.data.data

    return {
      totalRows: data.total_rows,
      validRows: data.valid_rows,
      issues: data.issues || [],
      subjectRules: data.subject_rules || [],
    }
  } catch (error: any) {
    console.error('Validation error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || error.message || 'Failed to validate data')
  }
}

/**
 * Convert display field name to backend db field
 */
function toBackendField(displayField: SystemField): string | null {
  const map: Record<SystemField, string> = {
    'Student ID': 'student_id',
    'Candidate ID': 'candidate_id',
    'Raw Score': 'raw_score',
    'Raw Correct': 'raw_correct',
    'Raw Wrong': 'raw_wrong',
    'Unanswered': 'raw_unanswered',
    'Deduction': 'deduction',
    'Ignore': '',
  }
  return map[displayField] || null
}

/**
 * Commit the import with the user's column mapping.
 * Backend processes all rows, calculates scores, and stores results.
 */
export async function commitImport(
  importFileId: number,
  mappings: ColumnMapping[],
  subjectId: number
): Promise<CommitSummary> {
  // Convert frontend display fields to backend db fields
  const columnMapping: Record<string, string> = {}
  mappings.forEach((m, index) => {
    if (m.mappedTo !== 'Ignore') {
      const dbField = toBackendField(m.mappedTo)
      if (dbField) {
        columnMapping[String(index)] = dbField
      }
    }
  })

  const response = await api.post('/exam-results/import/confirm', {
    import_file_id: importFileId,
    column_mapping: columnMapping,
    subject_id: subjectId,
  })

  const result = response.data.data

  return {
    imported: result.imported,
    skipped: result.skipped || 0,
    campaign: '2026',
    errors: result.errors || [],
  }
}
