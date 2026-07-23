<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

interface StatusConfig {
  label: string
  class: string
  dot: string
}

const statusConfigs: Record<string, StatusConfig> = {
  // New Home Investigation statuses (3-status system)
  Assigned: {
    label: 'Assigned',
    class: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  'In Progress': {
    label: 'In Progress',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  Submitted: {
    label: 'Submitted',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  // Legacy investigation statuses (5-status system)
  Pending: {
    label: 'Pending',
    class: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  Approved: {
    label: 'Approved',
    class: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  Rejected: {
    label: 'Rejected',
    class: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
}

const config = computed(() => {
  return statusConfigs[props.status] ?? {
    label: props.status,
    class: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
    :class="config.class"
  >
    <span class="inline-block h-1.5 w-1.5 rounded-full" :class="config.dot" />
    {{ config.label }}
  </span>
</template>
