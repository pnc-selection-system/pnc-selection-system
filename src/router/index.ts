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
  router.beforeEach(async (to) => {
    const authStore = useAuthStore(pinia)

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }

    // Permission check — skip for dashboard to avoid infinite redirect
    const requiredPermission = to.meta.permission as string | undefined
    const isAdmin =
      authStore.user?.role?.toLowerCase() === 'admin' ||
      String(authStore.user?.role_id) === '1'
    if (requiredPermission && authStore.isAuthenticated && to.name !== 'dashboard' && !isAdmin) {
      const perms = authStore.user?.permissions ?? []
      if (perms.length && !perms.includes(requiredPermission)) {
        return { name: 'dashboard' }
      }
    }

    return true
  })
}

export default router
