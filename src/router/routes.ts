import { authRoutes } from '@/features/auth/routes'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardView from '@/views/DashboardView.vue'

export const routes = [
	...authRoutes,
	{
		path: '/dashboard',
		component: AdminLayout,
		children: [
			{
				path: '',
				name: 'dashboard',
				component: DashboardView,
			},
		],
	},
]
