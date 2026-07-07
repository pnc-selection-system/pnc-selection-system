import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService } from '../servers/authService'
import type { AuthUser, LoginPayload } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(payload)
      user.value = response.user
      token.value = response.token
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
    error.value = null
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
})
