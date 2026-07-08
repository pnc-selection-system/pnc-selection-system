<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FunnelStage } from '../types/dashboard'

const props = defineProps<{
  stages: FunnelStage[]
}>()

const mode = ref<'stage' | 'drop-off'>('stage')

const maxValue = computed(() => Math.max(...props.stages.map((s) => s.value), 1))

const bars = computed(() =>
  props.stages.map((stage, i) => {
    const prev = i === 0 ? stage.value : props.stages[i - 1]!.value
    const dropOff = i === 0 ? 0 : Math.round(((prev - stage.value) / prev) * 100)
    return {
      ...stage,
      heightPct: (stage.value / maxValue.value) * 100,
      dropOff,
    }
  }),
)

function toggle() {
  mode.value = mode.value === 'stage' ? 'drop-off' : 'stage'
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Selection funnel
      </p>
      <button
        type="button"
        class="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-500 hover:border-slate-300 hover:bg-slate-50"
        @click="toggle"
      >
        {{ mode === 'stage' ? 'stage' : 'drop-off' }}
      </button>
    </div>

    <div class="mt-6 flex h-40 items-end gap-3">
      <div v-for="bar in bars" :key="bar.label" class="flex h-full flex-1 flex-col items-center justify-end">
        <span class="mb-1 text-xs font-medium text-slate-600">
          {{ mode === 'stage' ? bar.value.toLocaleString() : bar.dropOff ? `-${bar.dropOff}%` : '—' }}
        </span>
        <div
          class="w-full rounded-t transition-all"
          :class="bar.label === 'Selected' ? 'bg-blue-500' : 'bg-slate-200'"
          :style="{ height: `${Math.max(bar.heightPct, 4)}%` }"
        />
      </div>
    </div>

    <div class="mt-2 flex gap-3">
      <span v-for="bar in bars" :key="bar.label" class="flex-1 text-center text-xs text-slate-400">
        {{ bar.label }}
      </span>
    </div>
  </div>
</template>