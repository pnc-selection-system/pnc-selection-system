<template>
  <div class="animate-pulse space-y-4">
    <div class="h-3 w-40 rounded bg-slate-200" />
    <div class="h-7 w-56 rounded bg-slate-200" />
    <div class="h-14 rounded-lg bg-slate-100" />

    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <div class="h-8 w-24 rounded-full bg-slate-200" />
        <div class="h-8 w-36 rounded-full bg-slate-200" />
      </div>
      <div class="flex gap-2">
        <div class="h-9 w-24 rounded-md bg-slate-200" />
        <div class="h-9 w-44 rounded-md bg-slate-200" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-2.5 w-32 rounded bg-slate-200" />
        <div class="mt-6 flex h-44 items-end gap-3">
          <div v-for="i in 7" :key="i" class="w-full rounded-t bg-slate-200" :style="{ height: `${40 + (i % 4) * 20}%` }" />
        </div>
      </div>
      <div class="space-y-3 rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-2.5 w-20 rounded bg-slate-200" />
        <div v-for="i in 4" :key="i" class="h-4 rounded bg-slate-100" />
      </div>
    </div>

    <div class="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
      <div v-for="i in 4" :key="i" class="h-8 rounded bg-slate-100" />
    </div>
  </div>
</template>