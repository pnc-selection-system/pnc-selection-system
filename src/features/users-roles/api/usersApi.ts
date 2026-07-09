import type {
  User,
  UserCreatePayload,
  UserUpdatePayload,
  UserQueryParams,
  UserListResult,
} from '../types/user'
import { mockUsers } from '../mock/usersData'

// Replace this mock implementation with real HTTP calls (e.g. axios/fetch)
// against your backend once the API is available. Each function's
// signature is designed to map 1:1 onto a REST endpoint.

const DELAY_MS = 200
const delay = (ms = DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

let users: User[] = [...mockUsers]

function genId(): string {
  return `u-${Math.random().toString(36).slice(2, 10)}`
}

export const usersApi = {
  // GET /users
  async list(params: UserQueryParams = {}): Promise<UserListResult> {
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
    if (roleId) {
      filtered = filtered.filter((u) => u.roleIds.includes(roleId))
    }
    if (typeof isActive === 'boolean') {
      filtered = filtered.filter((u) => u.isActive === isActive)
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return { items, total, page, pageSize }
  },

  // GET /users/:id
  async get(id: string): Promise<User | undefined> {
    await delay()
    return users.find((u) => u.id === id)
  },

  // POST /users
  async create(payload: UserCreatePayload): Promise<User> {
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
  },

  // PUT/PATCH /users/:id
  async update(id: string, payload: UserUpdatePayload): Promise<User> {
    await delay()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error(`User ${id} not found`)
    const updated: User = {
      ...users[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    users = [...users.slice(0, idx), updated, ...users.slice(idx + 1)]
    return updated
  },

  // DELETE /users/:id
  async remove(id: string): Promise<void> {
    await delay()
    users = users.filter((u) => u.id !== id)
  },
}
