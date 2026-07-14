import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/exam/import-wizard',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'import-wizard',
        component: () => import('../importWizard/view/ImportWizardView.vue'),
      },
    ],
  },
]

export default routes
