import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/campaign',
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: () => import('@/features/campaign/pages/CampaignListPage.vue'),
  },
]
