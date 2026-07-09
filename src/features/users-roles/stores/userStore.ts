import { defineStore } from 'pinia'
import { userService } from '../services/userService'
import type { User, UserCreatePayload, UserUpdatePayload, UserQueryParams } from '../types/user'

interface UserState {
  items: User[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
  selectedUser: User | null
}

export const useUserStore = defineStore('users', {
  state: (): UserState => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    error: null,
    selectedUser: null,
  }),

  getters: {
    activeUsers: (state) => state.items.filter((u) => u.isActive),
    getUserById: (state) => (id: string) => state.items.find((u) => u.id === id),
  },

  actions: {
    async fetchUsers(params: UserQueryParams = {}) {
      this.loading = true
      this.error = null
      try {
        const result = await userService.fetchUsers({
          page: this.page,
          pageSize: this.pageSize,
          ...params,
        })
        this.items = result.items
        this.total = result.total
        this.page = result.page
        this.pageSize = result.pageSize
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    async createUser(payload: UserCreatePayload) {
      this.loading = true
      this.error = null
      try {
        const created = await userService.createUser(payload)
        this.items = [...this.items, created]
        this.total += 1
        return created
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to create user'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: string, payload: UserUpdatePayload) {
      this.loading = true
      this.error = null
      try {
        const updated = await userService.updateUser(id, payload)
        this.items = this.items.map((u) => (u.id === id ? updated : u))
        return updated
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update user'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: string) {
      this.loading = true
      this.error = null
      try {
        await userService.deleteUser(id)
        this.items = this.items.filter((u) => u.id !== id)
        this.total -= 1
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete user'
        throw err
      } finally {
        this.loading = false
      }
    },

    selectUser(user: User | null) {
      this.selectedUser = user
    },
  },
})
