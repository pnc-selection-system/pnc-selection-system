<script setup lang="ts">
import { computed } from 'vue'
import type { HStatus } from '../types/visit'

const props = defineProps<{
  candidateName: string
  status: HStatus
}>()

const statusClasses: Record<HStatus, string> = {
  Assigned: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Submitted: 'bg-green-50 text-green-700 border-green-200',
}
</script>

<template>
  <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
    <h2 class="text-lg font-bold text-slate-800">Visit · {{ candidateName }}</h2>
    <span class="rounded-md border px-2.5 py-1 text-xs font-medium" :class="statusClasses[status]">
      {{ status }}
    </span>
  </div>
</template>
