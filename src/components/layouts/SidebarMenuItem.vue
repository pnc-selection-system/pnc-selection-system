<script setup lang="ts">
defineProps<{
  title: string
  to?: string
  badge?: string
}>()
</script>

<template>
  <router-link
    v-if="to"
    :to="to"
    class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition mb-1"
    active-class="bg-slate-700 text-white border border-slate-600"
    exact-active-class="bg-slate-700 text-white border border-slate-600"
  >
    <div class="flex items-center gap-3">
      <div class="h-2 w-2 rounded-sm bg-gray-500" />
      <span class="text-xs text-gray-200">{{ title }}</span>
    </div>
    <span v-if="badge" class="text-[10px] text-gray-400">{{ badge }}</span>
  </router-link>
  <a
    v-else
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
