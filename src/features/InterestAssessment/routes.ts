import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/interest',
    name: 'interest-assessment',
    component: AppLayout,
    children: [
      {
        path: '',
        component: () => import('./view/InterestAssessmentView.vue'),
      },
    ],
  },
]

export default routes
