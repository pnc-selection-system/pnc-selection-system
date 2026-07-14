import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/results',
    name: 'results-analytics',
    component: AppLayout,
    children: [
      {
        path: '',
        component: () => import('./view/ResultsAnalyticsView.vue'),
      },
    ],
  },
]

export default routes
