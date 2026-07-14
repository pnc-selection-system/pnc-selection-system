<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)

const elType = computed(() => {
  if (props.variant === 'secondary') return 'default'
  if (props.variant === 'danger') return 'danger'
  return 'primary'
})

defineEmits<{
  click: [event: MouseEvent]
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <el-button
    :class="$attrs.class"
    :style="$attrs.style"
    :type="elType"
    :disabled="disabled"
    :loading="loading"
    native-type="button"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <slot />
  </el-button>
</template>

