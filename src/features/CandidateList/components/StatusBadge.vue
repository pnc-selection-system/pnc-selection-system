<template>
  <span :class="badgeClass" class="inline-block px-2 py-1 rounded text-xs font-medium">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    Investigating: 'bg-blue-100 text-blue-800',
    Assessed: 'bg-gray-100 text-gray-800',
    'Exam Done': 'bg-cyan-100 text-cyan-800',
  }
  return map[props.status] || 'bg-yellow-100 text-yellow-800'
})
</script>
