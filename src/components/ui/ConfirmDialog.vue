<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
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

function onCancel() {
  if (props.loading) return
  emit('cancel')
  emit('update:modelValue', false)
}

function onConfirm() {
  if (props.loading) return
  emit('confirm')
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :title="title"
    width="420px"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    append-to-body
    destroy-on-close
    @update:model-value="(v: boolean) => { if (!v) onCancel() }"
  >
    <p class="text-sm text-gray-600 leading-relaxed">{{ message }}</p>
    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton
          variant="secondary"
          :disabled="loading"
          @click="onCancel"
        >
          {{ cancelText || 'Cancel' }}
        </BaseButton>
        <BaseButton
          variant="danger"
          :loading="loading"
          :disabled="loading"
          @click="onConfirm"
        >
          {{ loading ? confirmText || 'Processing...' : (confirmText || 'Confirm') }}
        </BaseButton>
      </div>
    </template>
  </ElDialog>
</template>
