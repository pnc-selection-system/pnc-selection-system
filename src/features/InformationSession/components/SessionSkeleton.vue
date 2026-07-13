<template>
  <div class="animate-pulse space-y-4">
    <div class="h-3 w-40 rounded bg-slate-200" />
    <div class="h-7 w-64 rounded bg-slate-200" />
    <div class="h-14 rounded-lg bg-slate-100" />

    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <div class="h-8 w-24 rounded-full bg-slate-200" />
        <div class="h-8 w-24 rounded-full bg-slate-200" />
        <div class="h-8 w-28 rounded-full bg-slate-200" />
        <div class="h-8 w-28 rounded-full bg-slate-200" />
      </div>
      <div class="h-9 w-32 rounded-md bg-slate-200" />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
      <div class="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <div v-for="i in 3" :key="i" class="h-10 rounded bg-slate-100" />
      </div>
      <div class="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-10 rounded-t-lg bg-slate-200" />
        <div class="h-9 rounded bg-slate-100" />
        <div class="h-9 rounded bg-slate-100" />
        <div class="h-24 rounded bg-slate-100" />
      </div>
    </div>
  </div>
</template>