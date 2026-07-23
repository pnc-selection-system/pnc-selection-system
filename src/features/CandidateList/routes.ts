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
        beforeEnter: async () => {
          await prefetchProvincesAndNgos()
          const pinia = getActivePinia()
          if (pinia) {
            await prefetchCandidateList(pinia)
          }
        },
      },
    ],
  },
]
