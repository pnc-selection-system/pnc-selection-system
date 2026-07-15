import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/routes'
import informationSessionRoutes from '@/features/InformationSession/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...ngosPartnerRoutes,
  ...informationSessionRoutes,
]

