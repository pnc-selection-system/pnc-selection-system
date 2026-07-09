import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/exams',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'exam-configuration',
        component: () => import('./ExamConfigurationPage.vue'),
      },
    ],
  },
]

export default routes
