import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from '@/features/dashboard/view/routes'
import informationSessionRoutes from '@/features/InformationSession/view/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    ...dashboardRoutes,
    ...informationSessionRoutes
  ],
})

export default router
