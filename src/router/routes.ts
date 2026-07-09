import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import candidateListRoutes from '@/features/candidateList/view/routes'
import candidateProfileRoutes from '@/features/candidateProfile/view/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...candidateListRoutes,
  ...candidateProfileRoutes,
]
