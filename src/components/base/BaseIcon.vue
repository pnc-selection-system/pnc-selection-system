<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    color?: string
    strokeWidth?: number
  }>(),
  {
    size: 16,
    color: 'currentColor',
    strokeWidth: 1.5,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <slot />
  </svg>
</template>
