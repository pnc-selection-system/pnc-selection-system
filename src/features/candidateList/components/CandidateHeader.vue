<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

defineEmits<{
  create: []
  import: []
}>()
</script>

<template>
  <div>
    <p class="text-[10px] font-semibold uppercase text-slate-500">Candidates / List</p>
    <div class="mt-1 flex items-center justify-between">
      <h1 class="text-[24px] font-semibold tracking-tight text-slate-900">Candidate List</h1>
      <div class="flex gap-2">
        <BaseButton
          variant="secondary"
          class="!w-auto"
          @click="$emit('import')"
        >
          Bulk Import
        </BaseButton>
        <BaseButton
          class="!w-auto"
          @click="$emit('create')"
        >
          + New Candidate
        </BaseButton>
      </div>
    </div>
  </div>
</template>
