<script setup lang="ts">
defineProps<{
  sampleScores: number[]
  weightedScore: string
  previewResult: string
  previewResultColor: { bg: string; text: string }
}>()
</script>

<template>
  <div class="flex items-center gap-3 border-t border-slate-100 px-5 py-2.5">
    <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">Preview</span>
    <span class="text-xs text-slate-500">
      Sample {{ sampleScores.join(' / ') }} → weighted
      <span class="font-medium text-slate-700">{{ weightedScore }}</span>
      →
      <span
        class="ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
        :style="{
          backgroundColor: previewResultColor.bg,
          color: previewResultColor.text,
        }"
      >
        {{ previewResult }}
      </span>
    </span>
  </div>
</template>
