import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT (if we have one) to every outgoing request, but skip it for login.
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

// If the API ever responds with 401 (expired/invalid token), log the
// user out and stop further auth retries.
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