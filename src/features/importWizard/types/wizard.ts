export type WizardStepKey = 'subject' | 'upload' | 'map' | 'validate' | 'commit'

export interface WizardStep {
  key: WizardStepKey
  order: number
  label: string
}

export const WIZARD_STEPS: WizardStep[] = [
  { key: 'subject', order: 1, label: 'Select subject' },
  { key: 'upload', order: 2, label: 'Upload' },
  { key: 'map', order: 3, label: 'Map columns' },
  { key: 'validate', order: 4, label: 'Validate' },
  { key: 'commit', order: 5, label: 'Commit' },
]

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: string[]
  reqCodes: string[]
  fileFormats: string
}