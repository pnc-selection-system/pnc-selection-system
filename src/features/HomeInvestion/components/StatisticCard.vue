<script setup lang="ts">
defineProps<{
  title: string
  value: number
  icon?: string
  color?: 'blue' | 'green' | 'orange' | 'red' | 'slate'
}>()

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-mono text-xs font-medium uppercase tracking-wider text-slate-500">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ value }}</p>
      </div>
      <div v-if="icon" class="rounded-full p-3" :class="colorClasses[color || 'slate']">
        <span class="text-2xl">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>