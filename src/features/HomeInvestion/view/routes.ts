import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import HomeInvestigationView from './HomeInvestigationView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/home-investigation',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home-investigation',
        component: HomeInvestigationView,
      },
    ],
  },
]

export default routes
