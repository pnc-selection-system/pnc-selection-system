<script setup lang="ts">
import type { PageMeta } from '../types/session'

defineProps<{
  meta: PageMeta
}>()
</script>

<template>
  <div class="space-y-5">
    <!-- Breadcrumb and Title -->
    <div class="space-y-1.5">
      <p class="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
        {{ meta.breadcrumb.join(' / ') }}
      </p>
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
        {{ meta.title }}
      </h1>
    </div>
  </div>
</template>

<style scoped>
/* Page header specific styles */
</style>
