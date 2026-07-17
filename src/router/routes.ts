import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import candidateListRoutes from '@/features/candidateList/routes'
import candidateProfileRoutes from '@/features/candidateProfile/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/routes'
import informationSessionRoutes from '@/features/InformationSession/routes'
import examRoutes from '@/features/exam/routes'
import ImportWizardRoutes from '@/features/importWizard/routes'
import resultAnalyticRoutes from '@/features/resultAnalytic/routes'
import interestAssessmentRoutes from '@/features/InterestAssessment/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...candidateListRoutes,
  ...candidateProfileRoutes,
  ...ngosPartnerRoutes,
  ...informationSessionRoutes,
  ...examRoutes,
  ...ImportWizardRoutes,
  ...resultAnalyticRoutes,
  ...interestAssessmentRoutes,
]

