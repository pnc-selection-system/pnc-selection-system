import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'users',
        meta: { requiresAuth: true, permission: 'users:view' },
        component: () => import('./pages/UsersPage.vue'),
      },
    ],
  },
  {
    path: '/roles',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'roles',
        meta: { requiresAuth: true, permission: 'roles:view' },
        component: () => import('./pages/RolesPage.vue'),
      },
    ],
  },
]

export default routes
