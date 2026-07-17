<script setup lang="ts">
import { computed } from 'vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
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
  <div class="rounded border border-slate-200 bg-white p-5">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Score distribution
      </p>
      <div class="relative">
        <BaseSelect
          :model-value="modelValue"
          :options="provinces"
          placeholder="All Province"
          @update:model-value="$emit('update:modelValue', $event as string)"
        />
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