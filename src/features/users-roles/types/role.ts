export interface Permission {
  id: string
  key: string
  label: string
}

export interface PermissionGroup {
  group: string
  permissions: Permission[]
}

export interface Role {
  id: string | number
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface RoleCreatePayload {
  name: string
  description?: string
  permissions: string[]
}

export interface RoleUpdatePayload {
  name?: string
  description?: string
  permissions?: string[]
}

export interface RoleQueryParams {
  search?: string
  page?: number
  pageSize?: number
}

export interface RoleListResult {
  items: Role[]
  total: number
  page: number
  pageSize: number
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    group: 'Dashboard',
    permissions: [
      { id: 'p-dash-1', key: 'dashboard:view', label: 'View dashboard' },
    ],
  },
  {
    group: 'Campaigns',
    permissions: [
      { id: 'p-camp-1', key: 'campaigns:view', label: 'View campaigns' },
      { id: 'p-camp-2', key: 'campaigns:create', label: 'Create campaigns' },
      { id: 'p-camp-3', key: 'campaigns:edit', label: 'Edit campaigns' },
      { id: 'p-camp-4', key: 'campaigns:delete', label: 'Delete campaigns' },
    ],
  },
  {
    group: 'Candidates',
    permissions: [
      { id: 'p-cand-1', key: 'candidates:view', label: 'View candidates' },
      { id: 'p-cand-2', key: 'candidates:create', label: 'Create candidates' },
      { id: 'p-cand-3', key: 'candidates:edit', label: 'Edit candidates' },
      { id: 'p-cand-4', key: 'candidates:delete', label: 'Delete candidates' },
      { id: 'p-cand-5', key: 'candidates:import', label: 'Import candidates' },
    ],
  },
  {
    group: 'Information Sessions',
    permissions: [
      { id: 'p-sess-1', key: 'sessions:view', label: 'View sessions' },
      { id: 'p-sess-2', key: 'sessions:create', label: 'Create sessions' },
      { id: 'p-sess-3', key: 'sessions:edit', label: 'Edit sessions' },
      { id: 'p-sess-4', key: 'sessions:delete', label: 'Delete sessions' },
    ],
  },
  {
    group: 'NGOs & Partners',
    permissions: [
      { id: 'p-ngo-1', key: 'ngos:view', label: 'View NGOs & partners' },
      { id: 'p-ngo-2', key: 'ngos:create', label: 'Create NGOs & partners' },
      { id: 'p-ngo-3', key: 'ngos:edit', label: 'Edit NGOs & partners' },
      { id: 'p-ngo-4', key: 'ngos:delete', label: 'Delete NGOs & partners' },
    ],
  },
  {
    group: 'Exam',
    permissions: [
      { id: 'p-exam-1', key: 'exam:view', label: 'View exam configuration' },
      { id: 'p-exam-2', key: 'exam:manage', label: 'Manage exam configuration' },
      { id: 'p-exam-3', key: 'exam:import', label: 'Import exam results' },
      { id: 'p-exam-4', key: 'exam:results', label: 'View results & analytics' },
      { id: 'p-exam-5', key: 'exam:publish', label: 'Publish results' },
    ],
  },
  {
    group: 'Evaluation',
    permissions: [
      { id: 'p-eval-1', key: 'assessment:view', label: 'View interest assessments' },
      { id: 'p-eval-2', key: 'assessment:manage', label: 'Manage interest assessments' },
      { id: 'p-eval-3', key: 'homeinv:view', label: 'View home investigations' },
      { id: 'p-eval-4', key: 'homeinv:manage', label: 'Manage home investigations' },
    ],
  },
  {
    group: 'Voting & Selection',
    permissions: [
      { id: 'p-vote-1', key: 'voting:view', label: 'View voting & selection' },
      { id: 'p-vote-2', key: 'voting:vote', label: 'Cast votes' },
      { id: 'p-vote-3', key: 'voting:lock', label: 'Lock voting rounds' },
    ],
  },
  {
    group: 'Reports',
    permissions: [
      { id: 'p-rep-1', key: 'reports:view', label: 'View reports' },
      { id: 'p-rep-2', key: 'reports:export', label: 'Export reports' },
    ],
  },
  {
    group: 'Users & Roles',
    permissions: [
      { id: 'p-usr-1', key: 'users:view', label: 'View users' },
      { id: 'p-usr-2', key: 'users:create', label: 'Create users' },
      { id: 'p-usr-3', key: 'users:edit', label: 'Edit users' },
      { id: 'p-usr-4', key: 'users:delete', label: 'Delete users' },
      { id: 'p-usr-5', key: 'roles:view', label: 'View roles' },
      { id: 'p-usr-6', key: 'roles:manage', label: 'Manage roles' },
    ],
  },
]
