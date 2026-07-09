<script setup lang="ts">
import { computed } from 'vue'
import type { ScoreDistribution } from '../types/results'

const props = defineProps<{
  distribution: ScoreDistribution
  provinces: string[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const maxCount = computed(() => Math.max(...props.distribution.buckets.map((b) => b.count), 1))
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Score distribution
      </p>
      <div class="relative">
        <select
          class="appearance-none rounded-full border border-slate-200 bg-white py-1 pl-3 pr-7 text-xs text-slate-600 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
        </select>
        <svg class="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <div class="mt-6 flex h-44 items-end gap-3">
      <div
        v-for="bucket in distribution.buckets"
        :key="bucket.rangeLabel"
        class="flex h-full flex-1 flex-col items-center justify-end"
      >
        <div
          class="w-full rounded-t"
          :class="bucket.isModal ? 'bg-blue-200' : 'bg-slate-200'"
          :style="{ height: `${(bucket.count / maxCount) * 100}%` }"
        />
      </div>
    </div>

    <p class="mt-3 text-center font-mono text-xs text-slate-400">
      avg {{ distribution.avg }} · median {{ distribution.median }} · pass line at {{ distribution.passLine }}
      (blue bar = modal bin)
    </p>
  </div>
</template>