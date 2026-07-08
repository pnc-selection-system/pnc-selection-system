<script setup lang="ts">
import { computed } from 'vue'
import type { ProvincePassRate } from '../types/dashboard'

const props = defineProps<{
  data: ProvincePassRate[]
}>()

const maxRate = computed(() => Math.max(...props.data.map((d) => d.rate), 1))
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Pass rate by province
    </p>

    <div class="mt-5 space-y-3.5">
      <div v-for="row in data" :key="row.province" class="flex items-center gap-3">
        <span class="w-28 shrink-0 text-sm text-slate-600">{{ row.province }}</span>
        <div class="h-3 flex-1 rounded-full bg-slate-100">
          <div
            class="h-3 rounded-full bg-slate-300"
            :style="{ width: `${(row.rate / maxRate) * 100}%` }"
          />
        </div>
        <span class="w-10 shrink-0 text-right text-xs font-medium text-slate-500">{{ row.rate }}%</span>
      </div>
    </div>
  </div>
</template>