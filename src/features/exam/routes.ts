import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/exams',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'exam-configuration',
        meta: { requiresAuth: true, permission: 'exam:view' },
        component: () => import('./view/ExamConfigurationPage.vue'),
      },
    ],
  },
]

export default routes
