import type { RouteRecordRaw } from 'vue-router'
import { prefetchCandidateProfile } from '@/composables/useRoutePrefetch'

const routes: RouteRecordRaw[] = [
  {
    path: '/candidates/:id',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'candidate-profile',
        component: () => import('./view/CandidateProfilePage.vue'),
        props: true,
        beforeEnter: (to) => {
          // Route waits for data so the component renders immediately with cached data
          const id = to.params.id as string
          if (id) {
            return prefetchCandidateProfile(id)
          }
        },
      },
    ],
  },
]

export default routes
