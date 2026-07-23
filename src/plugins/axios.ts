import axios from 'axios'
import { getCookie, TOKEN_COOKIE } from '@/utils/cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
})

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>()

api.interceptors.request.use((config) => {
  if (config.url?.endsWith('/login')) {
    return config
  }

  const token = getCookie(TOKEN_COOKIE)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const key = `${response.config.method}:${response.config.url}`
    pendingRequests.delete(key)
    return response
  },
  async (error) => {
    const key = `${error.config?.method}:${error.config?.url}`
    pendingRequests.delete(key)
    
    if (error.response?.status === 401 && !error.config?.url?.endsWith('/logout')) {
      const { useAuthStore } = await import('@/features/auth/store/authStore')
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        await authStore.logout(false)
      }
    }
    throw error
  },
)

export default api
