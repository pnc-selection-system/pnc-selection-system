<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import EmptyState from '../../../components/ui/EmptyState.vue'
import type { ContactPerson } from '../types/partner'

defineProps<{
  contacts: ContactPerson[]
}>()

const emit = defineEmits<{
  addContact: []
}>()
</script>

<template>
  <div class="border-t border-slate-100">
    <div class="flex items-center justify-between px-4 py-2">
      <p class="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">
        Contact Persons
      </p>
    </div>
    <div class="px-4 pb-2">
      <BaseButton variant="secondary" class="!h-auto !w-full !border-dashed !py-2.5 !text-[13px]" @click="emit('addContact')">
        + Add contact
      </BaseButton>
    </div>

    <EmptyState
      v-if="contacts.length === 0"
      class="mt-2"
      title="No contacts yet"
      description="Add contact persons linked to this partner."
    />

    <table v-else class="w-full border-collapse text-xs">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50/30">
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">Name</th>
          <th class="px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">Role</th>
          <th class="px-4 py-2 text-right font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400">Contact</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="contact in contacts"
          :key="contact.id"
          class="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/80"
        >
          <td class="px-4 py-2.5 text-[#2D3748] text-[13px]">{{ contact.name }}</td>
          <td class="px-4 py-2.5 text-slate-500 text-[12px]">{{ contact.role }}</td>
          <td class="px-4 py-2.5 text-right text-slate-500 tabular-nums tracking-wide text-[12px]">
            {{ contact.phone || contact.email }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
