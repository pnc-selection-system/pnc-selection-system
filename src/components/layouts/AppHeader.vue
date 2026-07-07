<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/auth/composables/useAuth'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const { logout, initials } = useAuth()
const showLogoutConfirm = ref(false)
const isLoggingOut = ref(false)

function openSignOut() {
  showLogoutConfirm.value = true
}

async function doSignOut() {
  isLoggingOut.value = true
  try {
    await logout()
    router.push({ name: 'login' })
  } finally {
    isLoggingOut.value = false
    showLogoutConfirm.value = false
  }
}
</script>
<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-xs shrink-0 z-10">
    <!-- Left Section: Screens Button and Search Bar -->
    <div class="flex items-center gap-6">
      <button
        type="button"
        class="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all hover:border-gray-300">
        <span class="text-lg">☰</span>
        <span>Screens</span>
      </button>
      <div class="relative group">
        <input
          type="text"
          placeholder="Search candidates, sessions, NGOs..."
          class="w-[430px] rounded-full border border-gray-200 bg-gray-50/50 px-12 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-400"/>
        <svg
          class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
    </div>
    <!-- Right Section: Campaign Selector, Actions and Profile -->
    <div class="flex items-center gap-4">
      <!-- Campaign Indicator -->
      <button
        type="button"
        class="inline-flex items-center gap-2.5 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-semibold hover:border-gray-300 transition-colors">
        <span class="text-base">📅</span>
        <span class="text-gray-500 font-medium">Campaign:</span>
        <span class="text-gray-900">2026</span>
      </button>
      <!-- Sign out and Profile Avatar -->
      <BaseButton
        type="button"
        variant="secondary"
        class="inline-flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all hover:border-gray-300 w-auto"
        @click="openSignOut"
      >
        Sign out
      </BaseButton>
      <div class="h-8 w-px bg-gray-400 mx-1"></div>
      <button
        type="button"
        class="group relative flex items-center gap-3 focus:outline-none">
        <div class="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center font-bold text-gray-600 shadow-sm transform transition-transform active:scale-95">
          {{ initials || 'SM' }}
        </div>
      </button>
    </div>
  </header>
  <ConfirmDialog
    v-model="showLogoutConfirm"
    title="Sign out"
    message="Are you sure you want to sign out?"
    confirmText="Sign out"
    :loading="isLoggingOut"
    @confirm="doSignOut"
  />
</template>
<style scoped>
</style>

