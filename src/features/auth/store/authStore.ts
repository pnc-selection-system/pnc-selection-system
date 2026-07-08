import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginRequest, logout as logoutRequest } from '../servers/authService'
import type { AuthUser, LoginPayload } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  if (token.value) {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      user.value = JSON.parse(savedUser) as AuthUser
    }
  }

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null

    try {
      const response = await loginRequest(payload)
      user.value = response.user
      token.value = response.token

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))

      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid email or password'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(sendRequest = true) {
    if (sendRequest) {
      try {
        await logoutRequest()
      } catch {
        // Ignore logout failures, token may already be invalid or expired.
      }
    }

    user.value = null
    token.value = null
    error.value = null

    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
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
