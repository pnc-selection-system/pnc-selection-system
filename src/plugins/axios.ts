import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (config.url?.endsWith('/login')) {
    return config
  }

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        await authStore.logout(false)
      }
    }
    return Promise.reject(error)
  }
)

export default api