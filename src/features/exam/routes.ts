import type { RouteRecordRaw } from 'vue-router'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { prefetchCache } from '@/composables/useCacheFetch'
import * as examThresholdService from './service/examThresholdService'
import { CampaignStatus } from '@/enums'
import AppLayout from '@/layouts/AppLayout.vue'
import ExamConfigurationPage from './view/ExamConfigurationPage.vue'
import SubjectDetailPage from './view/SubjectDetailPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exams',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'exam-configuration',
        component: ExamConfigurationPage,
        beforeEnter: () => {
          // Fire-and-forget: pre-fetch campaigns into in-memory cache so the
          // component finds them instantly via useCacheFetch.
          fetchCampaigns()
            .then((campaigns) => {
              prefetchCache('campaigns', campaigns)
              // Also pre-fetch the first active campaign's config in parallel
              const active = campaigns.find(c => c.status === CampaignStatus.Active)
              if (active) {
                examThresholdService
                  .fetchCampaignThresholds(active.id)
                  .then((thresholds) => {
                    prefetchCache(`exam-config:${active.id}`, thresholds)
                  })
                  .catch(() => {})
              }
            })
            .catch(() => {})
          return true
        },
      },
      {
        path: ':id',
        name: 'exam-subject-detail',
        component: SubjectDetailPage,
      },
    ],
  },
]

export default routes
