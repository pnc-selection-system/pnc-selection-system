import { createRouter, createWebHistory } from 'vue-router'
import UsersAndRoles from '../views/UsersAndRoles.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'UsersAndRoles',
      component: UsersAndRoles,
    },
  ],
})

export default router
