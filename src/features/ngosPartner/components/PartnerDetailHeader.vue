<script setup lang="ts">
import { computed } from 'vue'
import type { Partner } from '../types/partner'
import BaseBadge from '../../../components/base/BaseBadge.vue'

const props = defineProps<{
  partner: Partner
}>()

const badgeType = computed(() =>
  props.partner.status === 'Active' ? 'success' : 'info'
)
</script>

<template>
  <div class="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
    <h1 class="text-[15px] font-bold text-slate-700 tracking-tight">
      {{ partner.organisation }}
    </h1>
    <BaseBadge :type="badgeType" size="default" class="!rounded !px-3 !py-1 !h-auto">
      {{ partner.status }}
    </BaseBadge>
  </div>
</template>
