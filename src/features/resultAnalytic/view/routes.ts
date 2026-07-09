import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/results',
    name: 'results-analytics',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: () => import('./ResultsAnalyticsView.vue'),
      },
    ],
  },
]

export default routes
