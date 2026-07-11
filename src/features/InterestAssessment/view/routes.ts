import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/interest',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'interest-assessment',
        component: () => import('./InterestAssessmentView.vue'),
      },
    ],
  },
]

export default routes
