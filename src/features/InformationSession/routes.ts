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
    ],
  },
]

export default routes
