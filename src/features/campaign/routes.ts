import type { RouteRecordRaw } from 'vue-router'
import { fetchCampaigns } from './services/campaign'

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
        beforeEnter: () => {
          fetchCampaigns()
            .then((campaigns) => {
              try {
                sessionStorage.setItem('campaigns', JSON.stringify(campaigns))
              } catch {}
            })
            .catch(() => {})
        },
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
