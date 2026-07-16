import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import InformationSessionView from './view/InformationSessionView.vue'

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
