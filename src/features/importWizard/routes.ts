import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import ImportWizardView from './view/ImportWizardView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/import-wizard',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'import-wizard',
        component: ImportWizardView,
      },
    ],
  },
]

export default routes
