export interface User {
  id: string
  name: string
  email: string
  role: 'Selection Manager' | 'Selection Officer' | 'Investigator' | 'Committee' | 'Officer'
  status: 'Active' | 'Invited' | 'Deactivated'
}

export interface Permission {
  capability: string
  admin: boolean
  manager: boolean
  officer: boolean
}

export interface Role {
  id: string
  name: string
}
