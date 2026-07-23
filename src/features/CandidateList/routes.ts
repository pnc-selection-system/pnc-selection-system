import { getActivePinia } from 'pinia'
import { prefetchCandidateList, prefetchProvincesAndNgos } from '@/composables/useRoutePrefetch'

export default [
  {
    path: '/candidates',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'CandidateList',
        component: () => import('./views/CandidateListView.vue'),
        beforeEnter: () => {
          // Fire-and-forget: navigation is instant, data loads in background
          prefetchProvincesAndNgos() // Pre-fill name caches + filter dropdowns
          const pinia = getActivePinia()
          if (pinia) {
            prefetchCandidateList(pinia)
          }
        },
      },
    ],
  },
]
