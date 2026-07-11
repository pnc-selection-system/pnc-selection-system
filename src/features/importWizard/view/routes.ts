import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/import-wizard',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'import-wizard',
        component: () => import('./ImportWizardView.vue'),
      },
    ],
  },
]

export default routes
