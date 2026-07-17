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
    class="flex items-center justify-between px-3 py-2 rounded text-gray-400 transition mb-1 hover:bg-slate-700/50"
    active-class="!text-white bg-slate-700 border border-slate-600 active-link"
  >
    <div class="flex items-center gap-3">
      <div class="dot w-2 h-2 rounded-sm bg-gray-500 transition" />
      <span class="text-xs">{{ title }}</span>
    </div>
    <span v-if="badge" class="badge text-[10px] text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded transition">{{ badge }}</span>
  </router-link>
  <a
    v-else
    href="#"
    class="flex items-center justify-between px-3 py-2 rounded text-gray-400 transition mb-1 hover:bg-slate-700/50"
  >
    <div class="flex items-center gap-3">
      <div class="dot w-2 h-2 rounded-sm bg-gray-500 transition" />
      <span class="text-xs">{{ title }}</span>
    </div>
    <span v-if="badge" class="badge text-[10px] text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded transition">{{ badge }}</span>
  </a>
</template>

<style scoped>
.active-link .dot {
  background-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}
.active-link .badge {
  color: #93c5fd;
  background-color: rgba(59, 130, 246, 0.1);
}
</style>
