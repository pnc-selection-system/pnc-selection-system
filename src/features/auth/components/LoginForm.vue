<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AppLogo from '@/components/AppLogo.vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { validateLoginForm, type LoginFormErrors } from '../validation/loginValidation'

const email = ref('')
const password = ref('')
const errors = ref<LoginFormErrors>({})
const { login, loading, error: authError } = useAuth()
const router = useRouter()
const successMessage = ref('')

async function handleSubmit() {
  if (loading.value) {
    return
  }

  const validationErrors = validateLoginForm(email.value, password.value)
  errors.value = validationErrors
  successMessage.value = ''

  if (Object.keys(validationErrors).length > 0) {
    return
  }

  try {
    const response = await login({
      email: email.value,
      password: password.value,
    })

    console.log('Login success:', response)
    successMessage.value = 'Login successful'
    await router.push({ name: 'dashboard' })
  } catch {
    successMessage.value = ''
    if (authError.value) {
      errors.value = {
        ...errors.value,
        password: authError.value,
      }
    }
  }
}
</script>

<template>
  <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-100">
    <div class="mb-6 flex flex-col items-center">
      <AppLogo class="mb-4 h-16 w-auto" />
      <h1 class="text-2xl font-semibold text-slate-900">Student Selection</h1>
      <p class="mt-2 text-sm text-slate-500">Management System</p>
    </div>

    <form class="mt-6 flex flex-col gap-4" @submit.prevent="handleSubmit">
      <div>
        <BaseInput id="email" v-model="email" label="Email" type="email" placeholder="Enter your email" />
        <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
      </div>

      <div>
        <BaseInput id="password" v-model="password" label="Password" type="password" placeholder="Enter your password" />
        <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
      </div>

      <a href="#" class="text-right text-sm font-medium text-blue-400 hover:text-blue-500">Forgot password?</a>

      <p v-if="successMessage" class="text-center text-sm text-green-600">{{ successMessage }}</p>

      <BaseButton type="submit" class="mt-2" :loading="loading">Login</BaseButton>
    </form>
  </div>
</template>






