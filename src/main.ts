import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router, { setupRouterGuard } from './router'
import { useAuthStore } from './features/auth/store/authStore'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
useAuthStore(pinia)
app.use(router)
setupRouterGuard(pinia)

app.mount('#app')
