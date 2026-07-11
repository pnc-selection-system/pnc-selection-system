<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import type { ContactPerson } from '../types/partner'

defineProps<{
  contacts: ContactPerson[]
}>()

const emit = defineEmits<{
  addContact: []
}>()
</script>

<template>
  <div class="border-t border-slate-200 px-4 py-2.5">
    <h3 class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-3">
      Contact Persons
    </h3>

    <div class="divide-y divide-slate-200">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="flex items-center justify-between px-4 py-2"
      >
        <div class="flex items-center gap-1.5 text-xs text-slate-700">
          <span class="font-semibold">{{ contact.name }}</span>
          <span class="text-slate-300">·</span>
          <span class="text-slate-400">{{ contact.role }}</span>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span v-if="contact.phone" class="tabular-nums tracking-wide">{{ contact.phone }}</span>
          <span v-if="contact.phone && contact.email" class="text-slate-300">·</span>
          <span v-if="contact.email" class="truncate max-w-[160px]">{{ contact.email }}</span>
        </div>
      </div>

      <BaseButton
        variant="secondary"
        class="!w-full !rounded-md !border-2 !border-dashed !border-slate-200 !px-4 !py-2.5 !text-xs !font-semibold !text-slate-400 !shadow-none !gap-1.5 hover:!border-blue-300 hover:!text-blue-600 hover:!bg-blue-50/40"
        @click="emit('addContact')"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 5v10M5 10h10" stroke-linecap="round" />
        </svg>
        Add contact
      </BaseButton>
    </div>
  </div>
</template>
