import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/outreach/information-sessions',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'information-sessions',
        meta: { requiresAuth: true },
        component: () => import('./view/InformationSessionView.vue'),
      },
    ],
  },
]

export default routes