import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import VotingSelectionView from './VotingSelectionView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/decision/voting-selection',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'voting-selection',
        component: VotingSelectionView,
      },
    ],
  },
]

export default routes
