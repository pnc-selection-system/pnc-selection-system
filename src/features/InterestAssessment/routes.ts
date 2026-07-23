import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/interest',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'interest-assessment',
        component: () => import('./view/InterestAssessmentView.vue'),
      },
    ],
  },
]

export default routes
