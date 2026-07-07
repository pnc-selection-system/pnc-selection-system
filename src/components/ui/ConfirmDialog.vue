<script setup lang="ts">
import { computed } from 'vue'
import { useSlots } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

const hasDefaultSlot = computed(() => !!useSlots().default)
</script>

<template>
  <el-dialog
    :model-value="props.modelValue"
    :title="props.title"
    width="420px"
    @update:model-value="(value: any) => emit('update:modelValue', value)"
    :close-on-click-modal="!props.loading"
    :close-on-press-escape="!props.loading"
    :destroy-on-close="false"
  >
    <div class="text-sm text-slate-600">
      <template v-if="hasDefaultSlot">
        <slot />
      </template>
      <template v-else>
        {{ props.message }}
      </template>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button size="small" @click="onCancel" :disabled="props.loading">
          {{ props.cancelText }}
        </el-button>
        <el-button type="primary" size="small" @click="onConfirm" :loading="props.loading">
          {{ props.confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-dialog__body {
  padding-top: 0;
}
</style>
