import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../../stores/userStore'
import type { User, UserCreatePayload, UserUpdatePayload } from '../../types/user'

/**
 * Thin composable wrapper around the user store, exposing a
 * component-friendly API (refs + convenience methods) so .vue
 * files don't need to know about Pinia directly.
 */
export function useUsers() {
  const store = useUserStore()
  const { items, total, page, pageSize, loading, error, selectedUser } = storeToRefs(store)

  const searchTerm = ref('')

  const filteredItems = computed(() => items.value)

  async function load(search?: string) {
    await store.fetchUsers({ search: search ?? searchTerm.value })
  }

  async function create(payload: UserCreatePayload): Promise<User> {
    return store.createUser(payload)
  }

  async function update(id: string, payload: UserUpdatePayload): Promise<User> {
    return store.updateUser(id, payload)
  }

  async function remove(id: string): Promise<void> {
    return store.deleteUser(id)
  }

  function select(user: User | null) {
    store.selectUser(user)
  }

  return {
    users: filteredItems,
    total,
    page,
    pageSize,
    loading,
    error,
    selectedUser,
    searchTerm,
    load,
    create,
    update,
    remove,
    select,
  }
}
