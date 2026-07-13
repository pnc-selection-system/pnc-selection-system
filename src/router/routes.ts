import { authRoutes } from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import campaignRoutes from '@/features/campaign/routes'
import informationSessionRoutes from '@/features/InformationSession/routes'
import reportExportRoutes from '@/features/reportExport/routes'

export const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...campaignRoutes,
  ...informationSessionRoutes,
  ...reportExportRoutes,
]
