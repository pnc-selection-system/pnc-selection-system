export interface Permission {
  id: string
  key: string
  label: string
}

export interface Role {
  id: string
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
