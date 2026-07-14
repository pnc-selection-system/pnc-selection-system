import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import NGOsPartnersView from './view/NGOsPartnersView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/ngos-partners',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'ngos-partners',
        component: NGOsPartnersView,
        meta: {
          title: 'NGOs & Partners',
          requiresAuth: true,
        },
      },
    ],
  },
]

export default routes
