<script setup lang="ts">
import { computed } from 'vue'
import type { PageMeta } from '../types/session'

const props = defineProps<{
  meta?: PageMeta | null
  breadcrumb?: string
  title?: string
}>()

const breadcrumbText = computed(() =>
  props.breadcrumb ?? props.meta?.breadcrumb.join(' / ') ?? 'Outreach'
)

const titleText = computed(() =>
  props.title ?? props.meta?.title ?? 'Information sessions'
)
</script>

<template>
  <div>
    <p class="text-[10px] font-semibold uppercase text-slate-500">
      {{ breadcrumbText }}
    </p>
    <div class="mt-1 flex items-center justify-between">
      <h1 class="text-[24px] font-semibold tracking-tight text-slate-900">
        {{ titleText }}
      </h1>
      <slot />
    </div>
  </div>
</template>

