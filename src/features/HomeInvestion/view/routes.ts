import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/home-investigation',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'home-investigation',
        component: () => import('./HomeInvestigationView.vue'),
      },
    ],
  },
]

export default routes