import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/import-wizard',
    name: 'import-wizard',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: () => import('../importWizard/view/ImportWizardView.vue'),
      },
    ],
  },
]

export default routes
