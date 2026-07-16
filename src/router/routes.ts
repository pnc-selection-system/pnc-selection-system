import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import candidateListRoutes from '@/features/CandidateList/routes'
import candidateProfileRoutes from '@/features/candidateProfile/routes'
import ngosPartnerRoutes from '@/features/ngosPartner/routes'
import examRoutes from '@/features/exam/routes'
import importWizardRoutes from '@/features/importWizard/routes'
import resultAnalyticRoutes from '@/features/resultAnalytic/routes'
import informationSessionRoutes from '@/features/InformationSession/routes'
import interestAssessmentRoutes from '@/features/InterestAssessment/routes'
import homeInvestionRoutes from '@/features/HomeInvestion/view/routes'
import votingRoutes from '@/features/Voting/view/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...candidateListRoutes,
  ...candidateProfileRoutes,
  ...informationSessionRoutes,
  ...ngosPartnerRoutes,
  ...examRoutes,
  ...importWizardRoutes,
  ...resultAnalyticRoutes,
  ...interestAssessmentRoutes,
  ...homeInvestionRoutes,
  ...votingRoutes,
]

