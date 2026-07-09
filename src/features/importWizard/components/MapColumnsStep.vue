<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { ColumnMapping, SystemField } from '../types/mapping'

const props = defineProps<{
  mappings: ColumnMapping[]
  systemFields: SystemField[]
}>()

const emit = defineEmits<{
  'update:mappings': [value: ColumnMapping[]]
  back: []
  runValidation: []
}>()

function updateMapping(index: number, value: SystemField) {
  const next = props.mappings.map((m, i) => (i === index ? { ...m, mappedTo: value } : m))
  emit('update:mappings', next)
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white">
    <div class="border-b border-slate-100 px-5 py-4">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Map file columns → system fields
      </p>
    </div>

    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-slate-100 bg-slate-50">
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">File column</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Sample value</th>
          <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">→ Maps to</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mapping, i) in mappings" :key="mapping.fileColumn" class="border-b border-slate-50 last:border-0">
          <td class="px-5 py-3 text-slate-800">{{ mapping.fileColumn }}</td>
          <td class="px-5 py-3 text-slate-500">{{ mapping.sampleValue }}</td>
          <td class="px-5 py-3">
            <div class="relative max-w-xs">
              <select
                class="w-full appearance-none rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                :value="mapping.mappedTo"
                @change="updateMapping(i, ($event.target as HTMLSelectElement).value as SystemField)"
              >
                <option v-for="field in systemFields" :key="field" :value="field">{{ field }}</option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center justify-between px-5 py-4">
      <BaseButton variant="secondary" @click="emit('back')">
        ‹ Back
      </BaseButton>
      <BaseButton @click="emit('runValidation')">
        Run validation ›
      </BaseButton>
    </div>
  </div>
</template>
