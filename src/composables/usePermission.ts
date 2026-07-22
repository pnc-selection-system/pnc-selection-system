import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/store/authStore'
import { mockRoles } from '@/features/users-roles/mock/rolesData'

export function usePermission() {
  const authStore = useAuthStore()

  const permissions = computed<Set<string>>(() => {
    const user = authStore.user
    if (!user) return new Set()

    // 1. Use permissions from backend profile if available
    if (user.permissions?.length) {
      return new Set(user.permissions)
    }

    // 2. Fallback: resolve from mock roles by role_id or role name
    const matched = mockRoles.find(
      (r) =>
        String(r.id) === String(user.role_id) ||
        r.name.toLowerCase() === (user.role ?? '').toLowerCase(),
    )

    return new Set(matched?.permissions ?? [])
  })

  const isAdmin = computed(() => {
    const user = authStore.user
    if (!user) return false
    console.log('[usePermission] user:', JSON.stringify(user))
    return (
      user.role?.toLowerCase() === 'admin' ||
      String(user.role_id) === '1'
    )
  })

  function can(...keys: string[]): boolean {
    return isAdmin.value || keys.every((k) => permissions.value.has(k))
  }

  function canAny(...keys: string[]): boolean {
    return isAdmin.value || keys.some((k) => permissions.value.has(k))
  }

  return { permissions, isAdmin, can, canAny }
}
