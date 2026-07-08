import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
]
