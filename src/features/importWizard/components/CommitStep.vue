<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { CommitSummary } from '../types/mapping'

defineProps<{
  summary: CommitSummary | null
}>()

const emit = defineEmits<{
  done: []
}>()
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-6">
    <div v-if="!summary" class="py-10 text-center text-sm text-slate-400">
      Committing import…
    </div>

    <div v-else class="py-6 text-center">
      <div class="rounded border border-dashed border-green-300 bg-green-50 px-6 py-8">
        <p class="text-lg font-semibold text-green-700">✓ {{ summary.imported.toLocaleString() }} results committed</p>
      </div>
      
      <div class="mt-6 text-left">
        <p class="text-sm text-slate-600">Scores auto-calculated · rankings generated · pass/fail evaluated.</p>
        <p class="text-sm text-slate-500">Results are still in <span class="font-medium text-amber-600">draft</span> — review on the results screen before publishing.</p>
      </div>

      <BaseButton class="mt-6" @click="emit('done')">
        Go to results ›
      </BaseButton>
    </div>
  </div>
</template>
