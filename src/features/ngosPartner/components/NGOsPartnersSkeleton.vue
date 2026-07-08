<template>
  <div class="animate-pulse space-y-4">
    <div class="h-7 w-52 rounded bg-slate-200" />
    <div class="h-14 rounded-lg bg-slate-100" />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.6fr]">
      <div class="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <div class="h-9 rounded bg-slate-100" />
        <div v-for="i in 3" :key="i" class="h-9 rounded bg-slate-100" />
      </div>
      <div class="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div class="h-6 w-40 rounded bg-slate-200" />
        <div class="h-3 w-32 rounded bg-slate-200" />
        <div class="h-10 rounded bg-slate-100" />
        <div class="h-10 rounded bg-slate-100" />
        <div class="mt-4 h-3 w-32 rounded bg-slate-200" />
        <div class="h-9 rounded bg-slate-100" />
        <div class="h-9 rounded bg-slate-100" />
      </div>
    </div>
  </div>
</template>