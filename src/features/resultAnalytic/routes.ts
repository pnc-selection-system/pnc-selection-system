import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/results',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'results-analytics',
        component: () => import('./view/ResultsAnalyticsView.vue'),
      },
    ],
  },
]

export default routes
