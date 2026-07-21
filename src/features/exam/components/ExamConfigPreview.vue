<script setup lang="ts">
defineProps<{
  sampleScores: number[]
  weightedScore: string
  previewResult: string
  previewResultColor: { bg: string; text: string }
}>()
</script>

<template>
  <div class="border-t border-slate-100 px-6 py-4">
    <h4 class="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">Live Preview</h4>
    <div class="rounded border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
      Sample {{ sampleScores.join(' / ') }} → weighted
      <span class="font-medium text-slate-800">{{ weightedScore }}</span>
      →
      <span
        class="ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
        :style="{
          backgroundColor: previewResultColor.bg,
          color: previewResultColor.text,
        }"
      >
        {{ previewResult }}
      </span>
    </div>
  </div>
</template>
