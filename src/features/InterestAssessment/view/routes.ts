import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/interest',
    name: 'interest-assessment',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: () => import('./InterestAssessmentView.vue'),
      },
    ],
  },
]

export default routes
