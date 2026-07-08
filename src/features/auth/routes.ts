import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginView from './views/LoginView.vue'

export const authRoutes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
    ],
  },
]
