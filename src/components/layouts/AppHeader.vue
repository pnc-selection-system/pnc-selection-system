<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/auth/composables/useAuth'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

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
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-xs shrink-0 relative z-10">
    <!-- Left Section: Screens Button and Search Bar -->
    <div class="flex items-center gap-6">
      <BaseButton
        variant="secondary"
        class="!w-auto inline-flex items-center gap-2 !border-gray-200 !rounded-lg !px-4 !py-2 hover:!bg-gray-50 !text-gray-700 text-sm !font-semibold hover:!border-gray-300"
      >
        <span class="text-lg">☰</span>
        <span>Screens</span>
      </BaseButton>
      <div class="relative group">
        <BaseInput
          placeholder="Search candidates, sessions, NGOs..."
          class="!w-[430px]"
        />
        <BaseIcon
          :size="16"
          :stroke-width="2.5"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </BaseIcon>
      </div>
    </div>
    <!-- Right Section: Campaign Selector, Actions and Profile -->
    <div class="flex items-center gap-4">
      <!-- Campaign Indicator -->
      <BaseButton
        variant="secondary"
        class="!w-auto inline-flex items-center gap-2.5 !border-gray-200 !rounded-lg !px-4 !py-2 !bg-white text-sm !font-semibold hover:!border-gray-300"
      >
        <span class="text-base">📅</span>
        <span class="text-gray-500 font-medium">Campaign:</span>
        <span class="text-gray-900">2026</span>
      </BaseButton>
      <!-- Sign out and Profile Avatar -->
      <button
        type="button"
        class="inline-flex items-center gap-2 border border-gray-200 rounded px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm font-semibold hover:border-gray-300 transition"
        @click="openSignOut"
      >
        Sign out
      </button>
      <div class="h-8 w-px bg-gray-400 mx-1"></div>
      <BaseButton
        variant="secondary"
        class="!w-auto group relative flex items-center gap-3 !border-0 !bg-transparent !shadow-none !p-0 hover:!bg-transparent focus:outline-none"
      >
        <div class="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center font-bold text-gray-600 shadow-sm transform transition-transform active:scale-95">
          {{ initials || 'SM' }}
        </div>
      </BaseButton>
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

