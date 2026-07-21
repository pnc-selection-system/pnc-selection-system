<script setup lang="ts">
import BaseBadge from '@/components/base/BaseBadge.vue'

defineProps<{
  totalWeight: number
  isValidWeight: boolean
}>()
</script>

<template>
  <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 pl-2.5 pr-6 py-3">
    <span class="flex items-center gap-1.5 text-xs text-slate-400">Weights must total 100%</span>
    <div class="flex items-center gap-2.5">
      <span class="text-[11px] text-slate-400">Total</span>
      <div class="flex items-center gap-2">
        <BaseBadge
          :type="isValidWeight ? 'success' : 'warning'"
          size="small"
        >
    
           
          {{ totalWeight }}% / 100%
        </BaseBadge>
      </div>
    </div>
  </div>
</template>
