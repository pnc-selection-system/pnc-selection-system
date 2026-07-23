import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/home-investigation',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home-investigation',
        component: () => import('./HomeInvestigationView.vue'),
      },
    ],
  },
]

export default routes