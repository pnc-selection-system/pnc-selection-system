import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../store/authStore'
import type { LoginPayload } from '../types/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, token, loading, error, isAuthenticated } = storeToRefs(authStore)

  const initials = computed(() => {
    const name = user.value?.name?.trim() || ''
    if (!name) {
      return ''
    }

    const parts = name.split(/\s+/).filter((part) => part.length > 0)
    if (parts.length === 0) {
      return ''
    }

    const firstPart = parts[0] ?? ''
    if (parts.length === 1) {
      return firstPart.slice(0, 2).toUpperCase()
    }

    const lastPart = parts[parts.length - 1] ?? ''
    const firstLetter = firstPart.charAt(0)
    const secondLetter = lastPart.charAt(0)
    return `${firstLetter}${secondLetter}`.toUpperCase()
  })

  async function login(payload: LoginPayload) {
    return authStore.login(payload)
  }

  function logout() {
    return authStore.logout()
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    initials,
    login,
    logout,
  }
}
