import api from '@/plugins/axios'
import type {
  Role,
  RoleCreatePayload,
  RoleUpdatePayload,
  RoleQueryParams,
  RoleListResult,
} from '../types/role'
import { mockRoles } from '../mock/rolesData'

const DELAY_MS = 200
const delay = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

let roles: Role[] = [...mockRoles]

function genId(): string {
  return `r-${Math.random().toString(36).slice(2, 10)}`
}

export const rolesApi = {
  async list(params: RoleQueryParams = {}): Promise<RoleListResult> {
    try {
      const { data } = await api.get('/roles', { params })
      return data
    } catch {
      await delay()
      const { search, page = 1, pageSize = 10 } = params
      let filtered = roles
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(
          (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
        )
      }
      const total = filtered.length
      const start = (page - 1) * pageSize
      return { items: filtered.slice(start, start + pageSize), total, page, pageSize }
    }
  },

  async get(id: string): Promise<Role | undefined> {
    try {
      const { data } = await api.get(`/roles/${id}`)
      return data
    } catch {
      await delay()
      return roles.find((r) => r.id === id)
    }
  },

  async create(payload: RoleCreatePayload): Promise<Role> {
    try {
      const { data } = await api.post('/roles', payload)
      return data
    } catch {
      await delay()
      const now = new Date().toISOString()
      const newRole: Role = {
        id: genId(),
        name: payload.name,
        description: payload.description ?? '',
        permissions: payload.permissions,
        isSystem: false,
        createdAt: now,
        updatedAt: now,
      }
      roles = [...roles, newRole]
      return newRole
    }
  },

  async update(id: string, payload: RoleUpdatePayload): Promise<Role> {
    try {
      const { data } = await api.put(`/roles/${id}`, payload)
      return data
    } catch {
      await delay()
      const idx = roles.findIndex((r) => r.id === id)
      if (idx === -1) throw new Error(`Role ${id} not found`)
      const existing = roles[idx]!
      const updated: Role = { ...existing, ...payload, id: existing.id, isSystem: existing.isSystem, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
      roles = [...roles.slice(0, idx), updated, ...roles.slice(idx + 1)]
      return updated
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/roles/${id}`)
    } catch {
      await delay()
      const target = roles.find((r) => r.id === id)
      if (target?.isSystem) throw new Error('System roles cannot be deleted')
      roles = roles.filter((r) => r.id !== id)
    }
  },
}
