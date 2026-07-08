<script setup lang="ts">
import { computed } from 'vue'
import type { OutcomeSplit } from '../types/dashboard'

const props = defineProps<{
  data: OutcomeSplit
}>()

const RADIUS = 60
const CIRC = 2 * Math.PI * RADIUS

const segments = computed(() => {
  const items = [
    { key: 'pass', value: props.data.pass, color: '#2563eb' }, // blue-600
    { key: 'fail', value: props.data.fail, color: '#e2e8f0' }, // slate-200
    { key: 'pending', value: props.data.pending, color: '#94a3b8' }, // slate-400
  ]
  let offset = 0
  return items.map((item) => {
    const length = (item.value / 100) * CIRC
    const seg = { ...item, length, offset }
    offset += length
    return seg
  })
})
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Outcome split
    </p>

    <div class="mt-4 flex items-center justify-center">
      <div class="relative h-40 w-40">
        <svg viewBox="0 0 150 150" class="h-full w-full -rotate-90">
          <circle
            v-for="seg in segments"
            :key="seg.key"
            cx="75"
            cy="75"
            :r="RADIUS"
            fill="none"
            :stroke="seg.color"
            stroke-width="18"
            :stroke-dasharray="`${seg.length} ${CIRC - seg.length}`"
            :stroke-dashoffset="-seg.offset"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center gap-0.5 font-mono text-xs text-slate-500">
          <span class="font-semibold text-blue-600">{{ data.pass }}% pass</span>
          <span>{{ data.fail }}% fail</span>
          <span>{{ data.pending }}% pending</span>
        </div>
      </div>
    </div>
  </div>
</template>