import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/results',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'results-analytics',
        meta: { requiresAuth: true, permission: 'exam:results' },
        component: () => import('./view/ResultsAnalyticsView.vue'),
      },
    ],
  },
]

export default routes
