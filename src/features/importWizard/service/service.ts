import api from '@/plugins/axios'
import type { PageMeta } from '../types/wizard'
import type {
  ColumnMapping,
  CommitSummary,
  SystemField,
  UploadedFile,
  ValidationResult,
} from '../types/mapping'

export const SYSTEM_FIELDS: SystemField[] = ['Student ID', 'Candidate ID', 'Raw Score', 'Raw Correct', 'Raw Wrong', 'Deduction', 'Ignore']

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
 */
export async function parseUploadedFile(
  file: File,
  campaignId: number,
  subjectId: number
): Promise<{ file: UploadedFile; mappings: ColumnMapping[]; importFileId: number }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('campaign_id', String(campaignId))
  formData.append('subject_id', String(subjectId))

  try {
    const response = await api.post('/exam-results/import/upload', formData)
    const data = response.data.data

    // Convert backend response to frontend format
    const mappings: ColumnMapping[] = data.detected_columns.map((col: string, index: number) => ({
      fileColumn: col,
      sampleValue: data.preview[index]?.student_id || '',
      mappedTo: data.auto_mapping[col] || 'Ignore',
    }))

    return {
      file: { name: data.file_name, rowCount: data.total_rows },
      mappings,
      importFileId: data.import_file_id,
    }
  } catch (error: any) {
    console.error('Upload error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || error.message || 'Failed to upload file')
  }
}

export async function runValidation(mappings: ColumnMapping[]): Promise<ValidationResult> {
  // For now, return mock validation data
  // In the future, this could call a validation endpoint
  return {
    totalRows: 128,
    validRows: 121,
    issues: [],
  }
}

export async function commitImport(
  importFileId: number,
  columnMapping: Record<string, string>,
  subjectId: number
): Promise<CommitSummary> {
  const response = await api.post('/exam-results/import/confirm', {
    import_file_id: importFileId,
    column_mapping: columnMapping,
    subject_id: subjectId,
  })

  const result = response.data.data

  return {
    imported: result.imported,
    skipped: result.skipped,
    campaign: '2026',
  }
}