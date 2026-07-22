import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/reports',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'reports',
        meta: { requiresAuth: true, permission: 'reports:view' },
        component: () => import('./view/ReportExportView.vue'),
      },
    ],
  },
]

export default routes
