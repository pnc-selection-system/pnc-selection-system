<script setup lang="ts">
import type { ContactPerson } from '../types/partner'

defineProps<{
  contacts: ContactPerson[]
}>()

const emit = defineEmits<{
  addContact: []
}>()
</script>

<template>
  <div class="px-6 pt-6 pb-8">
    <h3 class="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 mb-5">
      Contact Persons (1-to-many)
    </h3>

    <div class="space-y-3">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="flex items-center justify-between rounded-lg border border-slate-200 px-5 py-3.5 text-[15px]"
      >
        <div class="flex items-center gap-1.5">
          <span class="font-bold text-[#2D3748]">{{ contact.name }}</span>
          <span class="text-slate-300">·</span>
          <span class="text-slate-400">{{ contact.role }}</span>
        </div>
        <span class="text-slate-400 tabular-nums tracking-wide">
          {{ contact.phone || contact.email }}
        </span>
      </div>

      <button 
        class="mt-2 w-full flex items-center justify-center py-3.5 border border-slate-200 rounded-lg text-slate-500 font-bold text-[14px] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer" 
        @click="emit('addContact')"
      >
        + Add contact
      </button>
    </div>
  </div>
</template>
