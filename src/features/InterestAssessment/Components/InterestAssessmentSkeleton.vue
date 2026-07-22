<template>
  <div class="animate-pulse space-y-4">
    <div class="h-3 w-48 rounded bg-slate-200" />
    <div class="h-7 w-56 rounded bg-slate-200" />
    <div class="h-14 rounded-lg bg-slate-100" />
    <div class="flex gap-6 border-b border-slate-200 pb-3">
      <div class="h-4 w-24 rounded bg-slate-200" />
      <div class="h-4 w-32 rounded bg-slate-100" />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <div class="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <div v-for="i in 4" :key="i" class="h-9 rounded bg-slate-100" />
        <div class="h-9 rounded bg-slate-100" />
        <div class="h-16 rounded-lg bg-slate-100" />
      </div>
      <div class="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-3 w-40 rounded bg-slate-200" />
        <div class="h-16 rounded-lg bg-slate-100" />
        <div class="h-20 rounded-lg bg-slate-100" />
        <div class="h-9 rounded-lg bg-slate-100" />
      </div>
    </div>
  </div>
</template>