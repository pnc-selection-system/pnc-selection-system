<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
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
  <div class="rounded border border-slate-200 bg-white">
    <div class="border-b border-slate-100 px-5 py-4">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Map file columns → system fields
      </p>
    </div>

    <DataTableWrapper
      :data="mappings"
      :bordered="false"
      row-key="fileColumn"
      empty-text="No columns mapped"
      empty-description="Upload a file to see available columns"
    >
      <el-table-column label="File column" min-width="160">
        <template #default="{ row }">
          <span class="text-xs text-slate-800">{{ row.fileColumn }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Sample value" min-width="200">
        <template #default="{ row }">
          <span class="text-xs text-slate-500">{{ row.sampleValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="→ Maps to" min-width="220">
        <template #default="{ row }">
          <div class="relative">
            <select
              class="w-full appearance-none rounded border border-slate-200 px-3 py-1.5 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              :value="row.mappedTo"
              @change="updateMapping(mappings.indexOf(row), ($event.target as HTMLSelectElement).value as SystemField)"
            >
              <option v-for="field in systemFields" :key="field" :value="field">{{ field }}</option>
            </select>
            <svg class="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </template>
      </el-table-column>
    </DataTableWrapper>

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
