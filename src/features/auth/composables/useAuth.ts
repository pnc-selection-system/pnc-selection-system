import { storeToRefs } from 'pinia'
import { useAuthStore } from '../store/authStore'
import type { LoginPayload } from '../types/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, token, loading, error, isAuthenticated } = storeToRefs(authStore)

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
    login,
    logout,
  }
}
