<script setup lang="ts">
import type { PageMeta } from '../types/question'

defineProps<{
  meta: PageMeta
}>()
</script>

<template>
  <div>
    <p
      v-if="meta.breadcrumb.length"
      class="text-[10px] font-semibold uppercase tracking-wider text-slate-400"
    >
      {{ meta.breadcrumb.join(' / ') }}
    </p>
    <h1 class="mt-1 text-[24px] font-semibold tracking-tight text-slate-900">
      {{ meta.title }}
    </h1>
  </div>
</template>
