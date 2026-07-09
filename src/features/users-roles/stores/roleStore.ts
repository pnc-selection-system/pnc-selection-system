import { defineStore } from 'pinia'
import { roleService } from '../services/roleService'
import type { Role, RoleCreatePayload, RoleUpdatePayload, RoleQueryParams } from '../types/role'

interface RoleState {
  items: Role[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
  selectedRole: Role | null
}

export const useRoleStore = defineStore('roles', {
  state: (): RoleState => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    error: null,
    selectedRole: null,
  }),

  getters: {
    getRoleById: (state) => (id: string) => state.items.find((r) => r.id === id),
    getRoleName: (state) => (id: string) => state.items.find((r) => r.id === id)?.name ?? id,
  },

  actions: {
    async fetchRoles(params: RoleQueryParams = {}) {
      this.loading = true
      this.error = null
      try {
        const result = await roleService.fetchRoles({
          page: this.page,
          pageSize: this.pageSize,
          ...params,
        })
        this.items = result.items
        this.total = result.total
        this.page = result.page
        this.pageSize = result.pageSize
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch roles'
      } finally {
        this.loading = false
      }
    },

    async createRole(payload: RoleCreatePayload) {
      this.loading = true
      this.error = null
      try {
        const created = await roleService.createRole(payload)
        this.items = [...this.items, created]
        this.total += 1
        return created
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to create role'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateRole(id: string, payload: RoleUpdatePayload) {
      this.loading = true
      this.error = null
      try {
        const updated = await roleService.updateRole(id, payload)
        this.items = this.items.map((r) => (r.id === id ? updated : r))
        return updated
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update role'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteRole(id: string) {
      this.loading = true
      this.error = null
      try {
        await roleService.deleteRole(id)
        this.items = this.items.filter((r) => r.id !== id)
        this.total -= 1
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete role'
        throw err
      } finally {
        this.loading = false
      }
    },

    selectRole(role: Role | null) {
      this.selectedRole = role
    },
  },
})
