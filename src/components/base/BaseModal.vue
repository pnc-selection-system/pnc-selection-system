<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    width?: string | number
    top?: string
    closeOnClickModal?: boolean
    closeOnPressEscape?: boolean
    destroyOnClose?: boolean
    draggable?: boolean
  }>(),
  {
    modelValue: false,
    title: '',
    width: '520px',
    top: '',
    closeOnClickModal: true,
    closeOnPressEscape: true,
    destroyOnClose: false,
    draggable: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function handleUpdate(value: boolean) {
  emit('update:modelValue', value)
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :top="top || undefined"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :draggable="draggable"
    @update:model-value="handleUpdate"
  >
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
