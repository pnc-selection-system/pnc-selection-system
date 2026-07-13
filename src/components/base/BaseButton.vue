<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:pointer-events-none disabled:opacity-50"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
      'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50': variant === 'secondary',
      'text-slate-500 hover:text-slate-700': variant === 'ghost',
    }"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>
