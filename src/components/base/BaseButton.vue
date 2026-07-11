<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
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
</script>

<template>
  <el-button
    :type="variant === 'secondary' ? 'default' : 'primary'"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :native-type="type"
    :class="['w-full', $attrs.class]"
  >
    <slot />
  </el-button>
</template>

