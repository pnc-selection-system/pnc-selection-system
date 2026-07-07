<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'w-full rounded-lg px-4 py-2.5 font-semibold transition-colors',
      variant === 'secondary' ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-blue-600 text-white hover:bg-blue-700',
      disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    ]"
  >
    <slot />
  </button>
</template>
