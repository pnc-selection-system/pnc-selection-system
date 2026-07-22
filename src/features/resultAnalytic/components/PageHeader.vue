<script setup lang="ts">
import type { PageMeta } from '../types/results'

defineProps<{
  meta: PageMeta
}>()
</script>

<template>
  <div>
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      {{ meta.breadcrumb.join(' / ') }}
    </p>
    <h1 class="mt-1 text-[24px] font-semibold tracking-tight text-slate-900">
      {{ meta.title }}
    </h1>

    <div class="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-amber-600">Roles</span>
        <span class="text-sm text-amber-800">
          <template v-for="(r, i) in meta.roles" :key="r.role">
            {{ r.role }} <span class="text-amber-500">({{ r.action }})</span><span v-if="i < meta.roles.length - 1"> · </span>
          </template>
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-mono text-[11px] font-medium uppercase tracking-wider text-amber-600">Reqs</span>
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