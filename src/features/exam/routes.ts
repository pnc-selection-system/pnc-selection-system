import type { RouteRecordRaw } from 'vue-router'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { prefetchCache } from '@/composables/useCacheFetch'

const routes: RouteRecordRaw[] = [
  {
    path: '/exams',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'exam-configuration',
        component: () => import('./view/ExamConfigurationPage.vue'),
        beforeEnter: () => {
          // Fire-and-forget: pre-fetch campaigns into cache so the component
          // finds them instantly via useCacheFetch. Navigation is NOT blocked.
          fetchCampaigns()
            .then((campaigns) => prefetchCache('campaigns', campaigns))
            .catch(() => {})
          return true
        },
      },
      {
        path: ':id',
        name: 'exam-subject-detail',
        component: () => import('./view/SubjectDetailPage.vue'),
      },
    ],
  },
]

export default routes
