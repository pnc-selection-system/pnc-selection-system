import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        meta: { requiresAuth: true },
        component: () => import('./view/DashboardView.vue'),
      },
    ],
  },
]

export default routes