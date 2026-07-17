<template>
  <div class="animate-pulse space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <div class="h-8 w-32 rounded-full bg-slate-200" />
        <div class="h-8 w-32 rounded-full bg-slate-200" />
        <div class="h-8 w-28 rounded-full bg-slate-200" />
      </div>
      <div class="h-8 w-28 rounded-md bg-slate-200" />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-2.5 w-20 rounded bg-slate-200" />
        <div class="mt-3 h-7 w-16 rounded bg-slate-200" />
        <div class="mt-2 h-2.5 w-24 rounded bg-slate-100" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
        <div class="h-2.5 w-28 rounded bg-slate-200" />
        <div class="mt-6 flex items-end gap-3">
          <div v-for="i in 6" :key="i" class="w-full rounded-t bg-slate-200" :style="{ height: `${140 - i * 15}px` }" />
        </div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-2.5 w-24 rounded bg-slate-200" />
        <div class="mx-auto mt-8 h-40 w-40 rounded-full bg-slate-200" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-2.5 w-32 rounded bg-slate-200" />
        <div class="mt-6 space-y-3">
          <div v-for="i in 4" :key="i" class="h-3 rounded bg-slate-200" :style="{ width: `${60 + i * 8}%` }" />
        </div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-5">
        <div class="h-2.5 w-28 rounded bg-slate-200" />
        <div class="mt-6 flex items-end gap-3">
          <div v-for="i in 6" :key="i" class="w-full rounded-t bg-slate-200" :style="{ height: `${100 - (i % 3) * 20}px` }" />
        </div>
      </div>
    </div>
  </div>
</template>