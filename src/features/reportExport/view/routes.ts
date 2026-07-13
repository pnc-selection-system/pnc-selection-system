import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/reports',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'reports',
        meta: { requiresAuth: true },
        component: () => import('./ReportExportView.vue'),
      },
    ],
  },
]

export default routes
