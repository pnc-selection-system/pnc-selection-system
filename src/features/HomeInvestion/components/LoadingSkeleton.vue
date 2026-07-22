<script setup lang="ts">
defineProps<{
  type?: 'card' | 'table' | 'detail'
}>()
</script>

<template>
  <div class="animate-pulse space-y-4">
    <div v-if="type === 'card'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="i in 5" :key="i" class="rounded-lg border border-slate-200 bg-white p-6">
        <div class="h-4 w-24 rounded bg-slate-200"></div>
        <div class="mt-4 h-8 w-16 rounded bg-slate-300"></div>
      </div>
    </div>

    <div v-else-if="type === 'table'" class="rounded-lg border border-slate-200 bg-white">
      <div class="border-b border-slate-200 px-6 py-4">
        <div class="h-6 w-48 rounded bg-slate-200"></div>
      </div>
      <div class="divide-y divide-slate-200">
        <div v-for="i in 5" :key="i" class="px-6 py-4">
          <div class="flex items-center gap-4">
            <div class="h-4 w-32 rounded bg-slate-200"></div>
            <div class="h-4 w-40 rounded bg-slate-200"></div>
            <div class="h-4 w-28 rounded bg-slate-200"></div>
            <div class="h-4 w-20 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'detail'" class="rounded-lg border border-slate-200 bg-white p-6">
      <div class="flex items-center gap-4">
        <div class="h-16 w-16 rounded-full bg-slate-200"></div>
        <div class="flex-1 space-y-2">
          <div class="h-6 w-48 rounded bg-slate-200"></div>
          <div class="h-4 w-32 rounded bg-slate-200"></div>
        </div>
      </div>
      <div class="mt-6 space-y-4">
        <div class="h-4 w-full rounded bg-slate-200"></div>
        <div class="h-4 w-full rounded bg-slate-200"></div>
        <div class="h-4 w-3/4 rounded bg-slate-200"></div>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div class="h-4 w-3/4 rounded bg-slate-200"></div>
      <div class="h-4 w-1/2 rounded bg-slate-200"></div>
      <div class="h-4 w-5/6 rounded bg-slate-200"></div>
    </div>
  </div>
</template>