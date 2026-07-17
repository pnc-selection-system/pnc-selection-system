import type { RouteRecordRaw } from 'vue-router'
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
      },
    ],
  },
]

export default routes
