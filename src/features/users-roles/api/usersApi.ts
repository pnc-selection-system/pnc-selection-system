import api from '@/plugins/axios'
import type {
  User,
  UserCreatePayload,
  UserUpdatePayload,
  UserQueryParams,
  UserListResult,
} from '../types/user'
import { mockUsers } from '../mock/usersData'

const DELAY_MS = 200
const delay = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

let users: User[] = [...mockUsers]

function genId(): string {
  return `u-${Math.random().toString(36).slice(2, 10)}`
}

export const usersApi = {
  async list(params: UserQueryParams = {}): Promise<UserListResult> {
    try {
      const { data } = await api.get('/users', { params })
      return data
    } catch {
      await delay()
      const { search, roleId, isActive, page = 1, pageSize = 10 } = params
      let filtered = users
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.fullName.toLowerCase().includes(q),
        )
      }
      if (roleId) filtered = filtered.filter((u) => u.roleIds.includes(roleId))
      if (typeof isActive === 'boolean') filtered = filtered.filter((u) => u.isActive === isActive)
      const total = filtered.length
      const start = (page - 1) * pageSize
      return { items: filtered.slice(start, start + pageSize), total, page, pageSize }
    }
  },

  async get(id: string): Promise<User | undefined> {
    try {
      const { data } = await api.get(`/users/${id}`)
      return data
    } catch {
      await delay()
      return users.find((u) => u.id === id)
    }
  },

  async create(payload: UserCreatePayload): Promise<User> {
    try {
      const { data } = await api.post('/users', payload)
      return data
    } catch {
      await delay()
      const now = new Date().toISOString()
      const newUser: User = {
        id: genId(),
        username: payload.username,
        email: payload.email,
        fullName: payload.fullName,
        roleIds: payload.roleIds,
        isActive: payload.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      }
      users = [...users, newUser]
      return newUser
    }
  },

  async update(id: string, payload: UserUpdatePayload): Promise<User> {
    try {
      const { data } = await api.put(`/users/${id}`, payload)
      return data
    } catch {
      await delay()
      const idx = users.findIndex((u) => u.id === id)
      if (idx === -1) throw new Error(`User ${id} not found`)
      const existing = users[idx]!
      const updated: User = { ...existing, ...payload, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
      users = [...users.slice(0, idx), updated, ...users.slice(idx + 1)]
      return updated
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`)
    } catch {
      await delay()
      users = users.filter((u) => u.id !== id)
    }
  },
}
