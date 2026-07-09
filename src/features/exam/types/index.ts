export interface Exam {
  id: string
  name: string
  campaignId: string
  campaignName: string
  description: string
  status: 'draft' | 'active' | 'closed'
}

export const emptyForm: Exam = {
  id: '',
  name: '',
  campaignId: '',
  campaignName: '',
  description: '',
  status: 'draft',
}

export const statusLabels: Record<Exam['status'], string> = {
  active: 'Active',
  closed: 'Closed',
  draft: 'Draft',
}
