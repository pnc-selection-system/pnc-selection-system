import type { User } from '../types/user'

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@gmail.com',
    fullName: 'Super Admin',
    roleIds: ['1'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@gmail.com',
    fullName: 'Manager User',
    roleIds: ['2'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    username: 'officer',
    email: 'officer@gmail.com',
    fullName: 'Officer User',
    roleIds: ['3'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]
