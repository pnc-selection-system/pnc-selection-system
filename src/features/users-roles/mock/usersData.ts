import type { User } from '../types/user'

export const mockUsers: User[] = [
  {
    id: 'u-1',
    username: 'sm.dara',
    email: 'sm@pnc.org',
    fullName: 'Sok Dara',
    roleIds: ['r-1'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'u-2',
    username: 'so.bopha',
    email: 'so@pnc.org',
    fullName: 'Chan Bopha',
    roleIds: ['r-2'],
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'u-3',
    username: 'inv.sophea',
    email: 'inv@pnc.org',
    fullName: 'Pich Sophea',
    roleIds: ['r-3'],
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 'u-4',
    username: 'cmt.makara',
    email: 'cmt@pnc.org',
    fullName: 'Rin Makara',
    roleIds: ['r-4'],
    isActive: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
]
