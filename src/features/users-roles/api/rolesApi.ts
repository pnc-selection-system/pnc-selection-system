import type {
  Role,
  RoleCreatePayload,
  RoleUpdatePayload,
  RoleQueryParams,
  RoleListResult,
} from '../types/role'
import { mockRoles } from '../mock/rolesData'

// Replace this mock implementation with real HTTP calls (e.g. axios/fetch)
// against your backend once the API is available.

const DELAY_MS = 200
const delay = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

let roles: Role[] = [...mockRoles]

function genId(): string {
  return `r-${Math.random().toString(36).slice(2, 10)}`
}

export const rolesApi = {
  // GET /roles
  async list(params: RoleQueryParams = {}): Promise<RoleListResult> {
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
    const items = filtered.slice(start, start + pageSize)

    return { items, total, page, pageSize }
  },

  // GET /roles/:id
  async get(id: string): Promise<Role | undefined> {
    await delay()
    return roles.find((r) => r.id === id)
  },

  // POST /roles
  async create(payload: RoleCreatePayload): Promise<Role> {
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
  },

  // PUT/PATCH /roles/:id
  async update(id: string, payload: RoleUpdatePayload): Promise<Role> {
    await delay()
    const idx = roles.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Role ${id} not found`)
    const updated: Role = {
      ...roles[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    roles = [...roles.slice(0, idx), updated, ...roles.slice(idx + 1)]
    return updated
  },

  // DELETE /roles/:id
  async remove(id: string): Promise<void> {
    await delay()
    const target = roles.find((r) => r.id === id)
    if (target?.isSystem) {
      throw new Error('System roles cannot be deleted')
    }
    roles = roles.filter((r) => r.id !== id)
  },
}
