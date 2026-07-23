import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import InformationSessionView from './view/InformationSessionView.vue'
import { prefetchInfoSessions } from '@/composables/useRoutePrefetch'

const routes: RouteRecordRaw[] = [
  {
    path: '/outreach/information-sessions',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'information-sessions',
        component: InformationSessionView,
        meta: {
          title: 'Information Sessions',
          requiresAuth: true,
        },
        beforeEnter: () => {
          prefetchInfoSessions()
        },
      },
      {
        path: ':id',
        name: 'information-session-detail',
        meta: { requiresAuth: true },
        component: () => import('./view/InformationSessionDetailPage.vue'),
      },
    ],
  },
]

export default routes
