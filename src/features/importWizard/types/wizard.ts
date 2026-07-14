export type WizardStepKey = 'upload' | 'map' | 'validate' | 'commit'

export interface WizardStep {
  key: WizardStepKey
  order: number
  label: string
}

export const WIZARD_STEPS: WizardStep[] = [
  { key: 'upload', order: 1, label: 'Upload' },
  { key: 'map', order: 2, label: 'Map columns' },
  { key: 'validate', order: 3, label: 'Validate' },
  { key: 'commit', order: 4, label: 'Commit' },
]

export interface PageMeta {
  breadcrumb: string[]
  title: string
  roles: string[]
  reqCodes: string[]
  fileFormats: string
}