import axios from 'axios'
import { getCookie, TOKEN_COOKIE } from '@/utils/cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track whether a token refresh is in progress so we don't fire multiple refresh calls
let isRefreshing = false
// Queue of failed requests waiting for the refresh to complete
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  if (config.url?.endsWith('/login') || config.url?.endsWith('/refresh')) {
    return config
  }

  const token = getCookie(TOKEN_COOKIE)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh for 401 errors that aren't login/refresh/logout requests
    if (
      error.response?.status !== 401 ||
      originalRequest?.url?.endsWith('/login') ||
      originalRequest?.url?.endsWith('/refresh') ||
      originalRequest?.url?.endsWith('/logout')
    ) {
      throw error
    }

    // Dynamically import the store once and reuse
    const { useAuthStore } = await import('@/features/auth/store/authStore')
    const authStore = useAuthStore()

    // If we already retried this request, don't loop
    if (originalRequest._retry) {
      if (authStore.isAuthenticated) {
        await authStore.logout(false)
      }
      throw error
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      if (!authStore.isAuthenticated) {
        throw new Error('Not authenticated')
      }

      const success = await authStore.refreshToken()
      if (!success) {
        throw new Error('Refresh failed')
      }

      const newToken = getCookie(TOKEN_COOKIE)
      if (!newToken) {
        throw new Error('No token after refresh')
      }

      // Update the failed request with the new token and retry
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      processQueue(null, newToken)

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)

      // Refresh failed — log out
      await authStore.logout(false)

      throw error
    } finally {
      isRefreshing = false
    }
  },
)

export default api
