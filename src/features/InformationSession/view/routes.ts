import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/outreach/information-sessions',
    name: 'information-sessions',
    component: () => import('./InformationSessionView.vue'),
  },
]

export default routes