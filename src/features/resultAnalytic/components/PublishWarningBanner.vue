<script setup lang="ts">
defineProps<{
  reqCode?: string
}>()
</script>

<template>
  <div class="flex items-start gap-3 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3.5">
    <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
      1
    </span>
    <p class="text-sm text-amber-800">
      <strong>Publish & lock</strong> is irreversible and confirmation-gated — results become read-only and
      feed downstream ranking, assessment and voting<span v-if="reqCode"> ({{ reqCode }})</span>.
    </p>
  </div>
</template>