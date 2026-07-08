import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('./view/DashboardView.vue'),
      },
    ],
  },
]

export default routes