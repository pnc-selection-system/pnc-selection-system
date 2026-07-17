<script setup lang="ts">
import type { NgoPartner } from '../types/partner'
import BaseBadge from '../../../components/base/BaseBadge.vue'

defineProps<{
  partner: NgoPartner
}>()
</script>

<template>
  <div class="border-b border-slate-100 px-4 py-3">
    <div class="flex items-center justify-between">
      <h1 class="text-[16px] text-[#1A202C] tracking-tight">
        {{ partner.name }}
      </h1>
      <BaseBadge 
        v-if="partner.status === 'Active'"
        type="success"
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
    <div class="mt-2 flex flex-wrap gap-4 text-[12px] text-slate-500">
      <span v-if="partner.type" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
        {{ partner.type }}
      </span>
      <span v-if="partner.email" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        {{ partner.email }}
      </span>
      <span v-if="partner.phone" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
        {{ partner.phone }}
      </span>
      <span v-if="partner.address" class="flex items-center gap-1">
        <svg class="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        {{ partner.address }}
      </span>
    </div>
  </div>
</template>
