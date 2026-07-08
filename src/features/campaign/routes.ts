import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/campaigns',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'campaigns',
        component: () => import('./pages/CampaignListPage.vue'),
      },
    ],
  },
]

export default routes
