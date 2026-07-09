export interface User {
  id: string
  username: string
  email: string
  fullName: string
  roleIds: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserCreatePayload {
  username: string
  email: string
  fullName: string
  password: string
  roleIds: string[]
  isActive?: boolean
}

export interface UserUpdatePayload {
  username?: string
  email?: string
  fullName?: string
  roleIds?: string[]
  isActive?: boolean
}

export interface UserQueryParams {
  search?: string
  roleId?: string
  isActive?: boolean
  page?: number
  pageSize?: number
}

export interface UserListResult {
  items: User[]
  total: number
  page: number
  pageSize: number
}
