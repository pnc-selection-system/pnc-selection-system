import LoginView from './views/LoginView.vue'

export const authRoutes = [
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('./views/LoginView.vue'),
      },
    ],
  },
]
