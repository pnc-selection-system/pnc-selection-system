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
        meta: { requiresAuth: true, permission: 'homeinv:view' },
        component: () => import('./HomeInvestigationView.vue'),
      },
    ],
  },
]

export default routes