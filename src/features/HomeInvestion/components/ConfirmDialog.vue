<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const typeClasses: Record<string, string> = {
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-orange-600 hover:bg-orange-700',
  info: 'bg-blue-600 hover:bg-blue-700',
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50 transition-opacity" @click="emit('cancel')"></div>
      <div class="relative rounded-lg bg-white p-6 shadow-xl max-w-md w-full">
        <h3 class="text-lg font-semibold text-slate-900">{{ title || 'Confirm Action' }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ message || 'Are you sure you want to proceed?' }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="emit('cancel')"
          >
            {{ cancelText || 'Cancel' }}
          </button>
          <button
            type="button"
            class="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
            :class="typeClasses[type || 'info']"
            @click="emit('confirm')"
          >
            {{ confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>