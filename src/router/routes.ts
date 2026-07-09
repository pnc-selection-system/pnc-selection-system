import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/view/routes'
import importWizardRoutes from '@/features/importWizard/view/routes'
import resultAnalyticRoutes from '@/features/resultAnalytic/view/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...ngosPartnerRoutes,
  ...importWizardRoutes,
  ...resultAnalyticRoutes,
]
