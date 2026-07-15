import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginRequest, logout as logoutRequest } from '../service/authService'
import { getCookie, removeCookie, setCookie, TOKEN_COOKIE, USER_COOKIE } from '@/utils/cookie'
import type { AuthUser, LoginPayload } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(getCookie(TOKEN_COOKIE))
  const loading = ref(false)
  const error = ref<string | null>(null)

  if (token.value) {
    const savedUser = getCookie(USER_COOKIE)
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser) as AuthUser
      } catch {
        // Corrupted cookie data, ignore
      }
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

      setCookie(TOKEN_COOKIE, response.token, 7)
      setCookie(USER_COOKIE, JSON.stringify(response.user), 7)

      return response
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : 'Invalid email or password'
      error.value = rawMessage.replace(/[\n\r\t]/g, ' ')
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

    removeCookie(TOKEN_COOKIE)
    removeCookie(USER_COOKIE)
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
