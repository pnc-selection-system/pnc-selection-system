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
  <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
    <h1 class="text-[16px] text-[#1A202C] tracking-tight">
      {{ partner.organisation }}
    </h1>
    <BaseBadge 
      v-if="partner.status === 'Active'"
      :type="badgeType" 
      class="!rounded-lg !px-2 !py-0.5 !h-auto !text-[11px] border-emerald-200 bg-emerald-50 text-emerald-700"
    >
      {{ partner.status }}
    </BaseBadge>
    <BaseBadge 
      v-else
      type="info" 
      class="!rounded-lg !px-2 !py-0.5 !h-auto !text-[11px]"
    >
      {{ partner.status }}
    </BaseBadge>
  </div>
</template>
