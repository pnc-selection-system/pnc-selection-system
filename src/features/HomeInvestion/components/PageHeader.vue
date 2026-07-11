<script setup lang="ts">
import type { PageMeta } from '../types/visit'

defineProps<{
  meta: PageMeta
}>()
</script>

<template>
  <div>
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      {{ meta.breadcrumb.join(' / ') }}
    </p>
    <h1 class="mt-1 text-2xl font-bold text-slate-800">
      {{ meta.title }}
    </h1>

  </div>
</template>