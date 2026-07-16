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
        component: () => import('./VotingSelectionView.vue'),
      },
    ],
  },
]

export default routes