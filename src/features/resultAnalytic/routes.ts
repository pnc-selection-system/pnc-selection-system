import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import ResultsAnalyticsView from './view/ResultsAnalyticsView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/results',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'results-analytics',
        component: ResultsAnalyticsView,
      },
    ],
  },
]

export default routes
