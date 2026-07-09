import { usersApi } from '../api/usersApi'
import type {
  User,
  UserCreatePayload,
  UserUpdatePayload,
  UserQueryParams,
  UserListResult,
} from '../types/user'

// Service layer sits between the API and the rest of the app.
// It's the place for validation, mapping, or business rules that
// shouldn't live in the raw API client or in UI/store code.

function assertValidEmail(email: string) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!isValid) {
    throw new Error(`Invalid email address: ${email}`)
  }
}

export const userService = {
  fetchUsers(params?: UserQueryParams): Promise<UserListResult> {
    return usersApi.list(params)
  },

  fetchUser(id: string): Promise<User | undefined> {
    return usersApi.get(id)
  },

  createUser(payload: UserCreatePayload): Promise<User> {
    assertValidEmail(payload.email)
    return usersApi.create(payload)
  },

  updateUser(id: string, payload: UserUpdatePayload): Promise<User> {
    if (payload.email) assertValidEmail(payload.email)
    return usersApi.update(id, payload)
  },

  deleteUser(id: string): Promise<void> {
    return usersApi.remove(id)
  },
}
