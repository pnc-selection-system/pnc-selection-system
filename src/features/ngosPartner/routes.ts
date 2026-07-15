import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/ngos-partners',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'ngos-partners',
        component: () => import('./view/NGOsPartnersView.vue'),
        meta: {
          title: 'NGOs & Partners',
          requiresAuth: true,
        },
      },
    ],
  },
]

export default routes
