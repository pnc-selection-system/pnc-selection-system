<script setup lang="ts">
defineProps<{
  notes: string
}>()
</script>

<template>
  <div class="border-t border-slate-100 px-6 py-5">
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Candidate story & presentation notes
    </p>
    <p class="mt-3 text-sm leading-relaxed text-slate-600">
      {{ notes }}
    </p>
  </div>
</template>