import { rolesApi } from '../api/rolesApi'
import type {
  Role,
  RoleCreatePayload,
  RoleUpdatePayload,
  RoleQueryParams,
  RoleListResult,
} from '../types/role'

function assertHasPermissions(permissions: string[]) {
  if (!permissions || permissions.length === 0) {
    throw new Error('A role must have at least one permission')
  }
}

export const roleService = {
  fetchRoles(params?: RoleQueryParams): Promise<RoleListResult> {
    return rolesApi.list(params)
  },

  fetchRole(id: string): Promise<Role | undefined> {
    return rolesApi.get(id)
  },

  createRole(payload: RoleCreatePayload): Promise<Role> {
    assertHasPermissions(payload.permissions)
    return rolesApi.create(payload)
  },

  updateRole(id: string, payload: RoleUpdatePayload): Promise<Role> {
    if (payload.permissions) assertHasPermissions(payload.permissions)
    return rolesApi.update(id, payload)
  },

  deleteRole(id: string): Promise<void> {
    return rolesApi.remove(id)
  },
}
