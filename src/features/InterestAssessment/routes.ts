import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/interest',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'interest-assessment',
        component: () => import('../InterestAssessment/view/InterestAssessmentView.vue'),
      },
    ],
  },
]

export default routes
