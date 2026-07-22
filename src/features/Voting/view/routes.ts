import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/decision/voting-selection',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'voting-selection',
        meta: { requiresAuth: true, permission: 'voting:view' },
        component: () => import('./VotingSelectionView.vue'),
      },
    ],
  },
]

export default routes