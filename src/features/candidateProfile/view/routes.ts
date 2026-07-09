import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/candidates/:id',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'candidate-profile',
        component: () => import('./CandidateProfilePage.vue'),
        props: true,
      },
    ],
  },
]

export default routes
