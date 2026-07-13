import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/decision/voting-selection',
    component: AdminLayout,
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