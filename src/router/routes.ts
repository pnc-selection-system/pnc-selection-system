import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import candidateListRoutes from '@/features/candidateList/routes'
import candidateProfileRoutes from '@/features/candidateProfile/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/routes'
import ExamConfiguration from '@/features/exam/routes'
import ImportWizardView from '@/features/importWizard/routes'
import resultAnalyticRoutes from '@/features/resultAnalytic/routes'
import informationSessionRoutes from '@/features/InformationSession/routes'
import interestAssessmentRoutes from '@/features/InterestAssessment/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...candidateListRoutes,
  ...candidateProfileRoutes,
  ...informationSessionRoutes,
  ...ngosPartnerRoutes,
  ...ExamConfiguration,
  ...ImportWizardView,
  ...resultAnalyticRoutes,
  ...interestAssessmentRoutes,
]

