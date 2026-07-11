<template>
  <div class="relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="8.5" cy="8.5" r="6" stroke-linecap="round" />
      <path d="M13 13l4 4" stroke-linecap="round" />
    </svg>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Search name, ID, school..."
      class="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
