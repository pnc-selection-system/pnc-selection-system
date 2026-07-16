import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/ngos-partners',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'ngos-partners',
        meta: { requiresAuth: true },
        component: () => import('./view/NGOsPartnersView.vue'),
      },
    ],
  },
]

export default routes
