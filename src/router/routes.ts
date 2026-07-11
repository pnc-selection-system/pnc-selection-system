import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import informationSessionRoutes from '@/features/InformationSession/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/routes'
import candidateRoutes from '@/features/CandidateList/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...informationSessionRoutes,
  ...ngosPartnerRoutes,
  ...candidateRoutes,
]

