<script setup lang="ts">
import type { PageMeta } from '../types/session'

const props = defineProps<{
  meta: PageMeta | null
}>()
</script>

<template>
  <div>
    <p class="text-[10px] font-semibold uppercase text-slate-500">
      {{ meta?.breadcrumb.join(' / ') || 'Outreach' }}
    </p>
    <div class="mt-1 flex items-center justify-between">
      <h1 class="text-[24px] font-semibold tracking-tight text-slate-900">
        {{ meta?.title || 'Information sessions' }}
      </h1>
      <slot />
    </div>
  </div>
</template>

