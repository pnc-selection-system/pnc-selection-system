<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'small' | 'default' | 'large'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'default',
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
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :native-type="type"
    @click="(e: MouseEvent) => $emit('click', e)"
  >
    <slot />
  </el-button>
</template>

