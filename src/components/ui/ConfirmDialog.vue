<script setup lang="ts">
import { computed } from 'vue'

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

const visible = computed({
  get: () => props.isOpen ?? props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val)
})

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <ElDialog
    v-model="visible"
    :title="title"
    width="400px"
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
    align-center
    append-to-body
    destroy-on-close
  >
    <p class="text-sm text-slate-600 leading-relaxed">{{ message }}</p>
    <template #footer>
      <div class="flex justify-end gap-2">
        <ElButton :disabled="loading" @click="onCancel">
          {{ cancelText || 'Cancel' }}
        </ElButton>
        <ElButton type="danger" :loading="loading" @click="onConfirm">
          {{ confirmText || 'Confirm' }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
