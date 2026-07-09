import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/candidates',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'candidates',
        component: () => import('./CandidateListPage.vue'),
      },
    ],
  },
]

export default routes
