import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import NGOsPartnersView from './NGOsPartnersView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/ngos-partners',
    component: AdminLayout,
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
