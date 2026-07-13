<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'outline'
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
</script>

<template>
  <el-button
    :type="variant === 'secondary' || variant === 'outline' ? 'default' : 'primary'"
    :plain="variant === 'outline'"
    :disabled="disabled"
    :loading="loading"
    :native-type="type"
    :class="['w-full', $attrs.class]"
  >
    <slot />
  </el-button>
</template>

