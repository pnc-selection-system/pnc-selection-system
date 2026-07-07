import type { User, Permission, Role } from './types'

export const users: User[] = [
  {
    id: '1',
    name: 'S. Manager',
    email: 'sm@pnc.org',
    role: 'Selection Manager',
    status: 'Active',
  },
  {
    id: '2',
    name: 'O. Officer',
    email: 'oo@pnc.org',
    role: 'Selection Officer',
    status: 'Active',
  },
  {
    id: '3',
    name: 'I. Field',
    email: 'if@pnc.org',
    role: 'Investigator',
    status: 'Active',
  },
  {
    id: '4',
    name: 'C. Member',
    email: 'cm@pnc.org',
    role: 'Committee',
    status: 'Invited',
  },
  {
    id: '5',
    name: 'X. Former',
    email: 'xf@pnc.org',
    role: 'Officer',
    status: 'Deactivated',
  },
]

export const permissions: Permission[] = [
  {
    capability: 'Manage users',
    admin: true,
    manager: false,
    officer: false,
  },
  {
    capability: 'Configure exam',
    admin: true,
    manager: true,
    officer: false,
  },
  {
    capability: 'Edit candidate',
    admin: true,
    manager: true,
    officer: true,
  },
  {
    capability: 'Publish results',
    admin: true,
    manager: true,
    officer: false,
  },
  {
    capability: 'Cast vote',
    admin: false,
    manager: false,
    officer: false,
  },
]

export const roles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
  },
  {
    id: 'manager',
    name: 'Manager',
  },
  {
    id: 'officer',
    name: 'Officer',
  },
]
