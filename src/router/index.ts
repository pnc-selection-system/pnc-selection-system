import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/features/auth/store/authStore'
import type { Pinia } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

export function setupRouterGuard(pinia: Pinia) {
  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.name === 'login' && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }
    return true
  })
}

export default router
