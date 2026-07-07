<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
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
    :type="variant === 'secondary' ? 'default' : 'primary'"
    :disabled="disabled"
    :loading="loading"
    :native-type="type"
    class="w-full"
  >
    <slot />
  </el-button>
</template>
