import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoleStore } from '../../stores/roleStore'
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '../../types/role'

/**
 * Thin composable wrapper around the role store, exposing a
 * component-friendly API (refs + convenience methods).
 */
export function useRoles() {
  const store = useRoleStore()
  const { items, total, page, pageSize, loading, error, selectedRole } = storeToRefs(store)

  const searchTerm = ref('')

  const filteredItems = computed(() => items.value)

  async function load(search?: string) {
    await store.fetchRoles({ search: search ?? searchTerm.value })
  }

  async function create(payload: RoleCreatePayload): Promise<Role> {
    return store.createRole(payload)
  }

  async function update(id: string, payload: RoleUpdatePayload): Promise<Role> {
    return store.updateRole(id, payload)
  }

  async function remove(id: string): Promise<void> {
    return store.deleteRole(id)
  }

  function select(role: Role | null) {
    store.selectRole(role)
  }

  function nameFor(id: string): string {
    return store.getRoleName(id)
  }

  return {
    roles: filteredItems,
    total,
    page,
    pageSize,
    loading,
    error,
    selectedRole,
    searchTerm,
    load,
    create,
    update,
    remove,
    select,
    nameFor,
  }
}
