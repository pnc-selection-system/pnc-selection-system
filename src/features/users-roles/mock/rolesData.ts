import type { Role } from '../types/role'

export const mockRoles: Role[] = [
  {
    id: 'r-1',
    name: 'Selection Manager',
    description: 'Manages the full selection process',
    permissions: ['users:read', 'users:write', 'roles:read'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'r-2',
    name: 'Selection Officer',
    description: 'Handles candidate processing',
    permissions: ['users:read'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'r-3',
    name: 'Investigator',
    description: 'Conducts home investigations',
    permissions: ['users:read'],
    isSystem: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'r-4',
    name: 'Committee',
    description: 'Votes on final selection',
    permissions: ['users:read'],
    isSystem: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]
