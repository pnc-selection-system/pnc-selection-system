<script setup lang="ts">
import type { PageMeta } from '../types/partner'


defineProps<{
  meta: PageMeta
}>()
</script>

<template>
  <div>
    <h1 class="text-2xl text-slate-800">
      {{ meta.title }}
    </h1>

    <div class="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="font-mono text-[11px] uppercase tracking-wider text-amber-600">Roles</span>
        <span class="text-sm text-amber-800">{{ meta.roles.join(' · ') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-mono text-[11px] uppercase tracking-wider text-amber-600">Reqs</span>
        <span class="rounded border border-amber-200 bg-white px-2 py-0.5 font-mono text-xs text-amber-700">
          {{ meta.reqRange[0] }}
        </span>
        <span class="text-amber-500">...</span>
        <span class="rounded border border-amber-200 bg-white px-2 py-0.5 font-mono text-xs text-amber-700">
          {{ meta.reqRange[1] }}
        </span>
      </div>
    </div>
  </div>
</template>