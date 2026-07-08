<script setup lang="ts">
import type { DashboardFilters, FilterOptions } from '../types/filter'

const props = defineProps<{
  modelValue: DashboardFilters
  options: FilterOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DashboardFilters]
  export: []
}>()

function update<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.campaign"
          @change="update('campaign', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="c in options.campaigns" :key="c" :value="c">Campaign: {{ c }}</option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.province"
          @change="update('province', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="p in options.provinces" :key="p" :value="p">Province: {{ p }}</option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.status"
          @change="update('status', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="s in options.statuses" :key="s" :value="s">Status: {{ s }}</option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <button
      type="button"
      class="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      @click="emit('export')"
    >
      Export view
      <svg class="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none">
        <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>