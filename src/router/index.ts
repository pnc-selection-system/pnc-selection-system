import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from '@/features/dashboard/view/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    ...dashboardRoutes
  ],
})

export default router
