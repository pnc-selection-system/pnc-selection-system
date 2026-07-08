<script setup lang="ts">
import { computed } from 'vue'
import type { YearComparisonPoint } from '../types/dashboard'

const props = defineProps<{
  data: YearComparisonPoint[]
  tag?: string
}>()

const maxValue = computed(() =>
  Math.max(...props.data.flatMap((d) => [d.value2025, d.value2026]), 1),
)
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Year-over-year
      </p>
      <span
        v-if="tag"
        class="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[11px] text-blue-600"
      >
        {{ tag }}
      </span>
    </div>

    <div class="mt-6 flex h-40 items-end gap-4">
      <div v-for="point in data" :key="point.label" class="flex h-full flex-1 items-end justify-center gap-1">
        <div
          class="w-1/2 rounded-t bg-slate-200"
          :style="{ height: `${(point.value2025 / maxValue) * 100}%` }"
        />
        <div
          class="w-1/2 rounded-t bg-blue-400"
          :style="{ height: `${(point.value2026 / maxValue) * 100}%` }"
        />
      </div>
    </div>

    <div class="mt-2 flex gap-4">
      <span v-for="point in data" :key="point.label" class="flex-1 text-center text-xs text-slate-400">
        {{ point.label }}
      </span>
    </div>

    <p class="mt-3 text-xs text-slate-400">
      <span class="text-slate-400">grey = 2025</span> · <span class="text-blue-500">blue = 2026</span>
    </p>
  </div>
</template>