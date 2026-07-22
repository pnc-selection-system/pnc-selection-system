import type { RouteRecordRaw } from 'vue-router'
import { prefetchNgoPartners } from '@/composables/useRoutePrefetch'

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
        beforeEnter: () => {
          // Fire-and-forget: navigation is instant, data loads in background
          prefetchNgoPartners()
        },
      },
    ],
  },
]

export default routes
