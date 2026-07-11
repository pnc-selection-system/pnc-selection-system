<template>
  <div v-if="isOpen || modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
      <h2 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h2>
      <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="onCancel" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
          {{ cancelText || 'Cancel' }}
        </button>
        <button @click="$emit('confirm')" :disabled="loading" class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition font-medium">
          {{ loading ? 'Loading...' : (confirmText || 'Delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen?: boolean
  modelValue?: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
  'update:modelValue': [value: boolean]
}>()

const onCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>
