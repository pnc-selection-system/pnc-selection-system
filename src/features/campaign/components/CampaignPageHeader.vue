<script setup lang="ts">
defineProps<{
  breadcrumb: string
  title: string
}>()
</script>

<template>
  <div>
    <p class="text-[10px] font-semibold uppercase text-slate-500">{{ breadcrumb }}</p>
    <div class="mt-1 flex items-center justify-between">
      <h1 class="text-[24px] font-semibold tracking-tight text-slate-900">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
