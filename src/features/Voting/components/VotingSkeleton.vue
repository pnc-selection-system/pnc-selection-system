<template>
  <div class="animate-pulse space-y-4">
    <div class="h-3 w-44 rounded bg-slate-200" />
    <div class="h-7 w-48 rounded bg-slate-200" />
    <div class="h-14 rounded-lg bg-slate-100" />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_240px]">
      <div class="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        <div v-for="i in 3" :key="i" class="h-12 rounded bg-slate-100" />
      </div>
      <div class="space-y-3 rounded-lg border border-slate-200 bg-white p-6">
        <div class="h-6 w-56 rounded bg-slate-200" />
        <div class="flex gap-3">
          <div class="h-20 w-20 rounded bg-slate-100" />
          <div class="flex-1 space-y-2">
            <div class="h-9 rounded bg-slate-100" />
            <div class="h-9 rounded bg-slate-100" />
          </div>
        </div>
        <div class="h-16 rounded bg-slate-100" />
        <div class="h-9 rounded bg-slate-100" />
      </div>
      <div class="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-3 w-16 rounded bg-slate-200" />
        <div v-for="i in 3" :key="i" class="h-4 rounded bg-slate-100" />
        <div class="h-9 rounded-lg bg-slate-100" />
      </div>
    </div>
  </div>
</template>