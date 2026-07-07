<script setup lang="ts">
import type { SessionFilterOptions, SessionFilters } from '../types/filter'

const props = defineProps<{
  modelValue: SessionFilters
  options: SessionFilterOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFilters]
  new: []
}>()

function update<K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })}
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.province"
          @change="update('province', ($event.target as HTMLSelectElement).value)">
          <option v-for="p in options.provinces" :key="p" :value="p">
            {{ p === 'All' ? 'Province' : p }}
          </option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.school"
          @change="update('school', ($event.target as HTMLSelectElement).value)">
          <option v-for="s in options.schools" :key="s" :value="s">
            {{ s === 'All' ? 'School' : s }}
          </option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.dateRange"
          @change="update('dateRange', ($event.target as HTMLSelectElement).value)">
          <option v-for="d in options.dateRanges" :key="d" :value="d">
            {{ d === 'All' ? 'Date range' : d }}
          </option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <button
      type="button"
      class="flex items-center gap-2 rounded-md bg-[#4A72B2] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3D5A8F] transition-colors"
      @click="emit('new')">
      <span class="text-lg leading-none">+</span>
      New session
    </button>
  </div>
</template>