export interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'closed'
}

export const emptyForm: Campaign = {
  id: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'draft',
}

export const statusBadges: Record<Campaign['status'], { bg: string; text: string; dot: string }> = {
  active: { bg: '#EFF6FF', text: '#2563EB', dot: '#2563EB' },
  closed: { bg: '#ECFDF5', text: '#059669', dot: '#059669' },
  draft: { bg: '#F3F4F6', text: '#6B7280', dot: '#6B7280' },
}

export const statusLabels: Record<Campaign['status'], string> = {
  active: 'Active',
  closed: 'Closed',
  draft: 'Draft',
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
