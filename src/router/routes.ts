import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/view/routes'
import importWizardRoutes from '@/features/importWizard/view/routes'
import resultAnalyticRoutes from '@/features/resultAnalytic/view/routes'
import interestAssessmentRoutes from '@/features/InterestAssessment/view/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...ngosPartnerRoutes,
  ...importWizardRoutes,
  ...resultAnalyticRoutes,
  ...interestAssessmentRoutes,
]
