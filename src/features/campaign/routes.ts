import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/campaigns',
    component: AdminLayout,
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
