<script setup lang="ts">
defineProps<{
  title: string
  badge?: string
}>()
</script>

<template>
  <a
    href="#"
    class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition mb-1"
  >
    <div class="flex items-center gap-3">
      <div class="h-2 w-2 rounded-sm bg-gray-500" />
      <span class="text-xs text-gray-200">{{ title }}</span>
    </div>
    <span v-if="badge" class="text-[10px] text-gray-400">{{ badge }}</span>
  </a>
</template>
