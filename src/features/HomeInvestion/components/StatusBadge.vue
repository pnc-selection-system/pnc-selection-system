<script setup lang="ts">
import type { InvestigationStatus } from '../types/investigation'

defineProps<{
  status: InvestigationStatus
}>()

const statusConfig: Record<InvestigationStatus, { label: string; class: string }> = {
  Pending: {
    label: 'Pending',
    class: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  'In Progress': {
    label: 'In Progress',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Submitted: {
    label: 'Submitted',
    class: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  Approved: {
    label: 'Approved',
    class: 'bg-green-50 text-green-700 border-green-200',
  },
  Rejected: {
    label: 'Rejected',
    class: 'bg-red-50 text-red-700 border-red-200',
  },
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
    :class="statusConfig[status].class"
  >
    {{ statusConfig[status].label }}
  </span>
</template>