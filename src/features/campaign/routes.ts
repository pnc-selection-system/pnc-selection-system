import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/campaigns',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'campaigns',
        meta: { requiresAuth: true },
        component: () => import('./view/CampaignListPage.vue'),
      },
      {
        path: ':id',
        name: 'campaign-detail',
        meta: { requiresAuth: true },
        component: () => import('./view/CampaignDetailPage.vue'),
      },
    ],
  },
]

export default routes
