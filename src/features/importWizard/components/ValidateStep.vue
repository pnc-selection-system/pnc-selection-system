<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import type { ValidationResult } from '../types/mapping'

defineProps<{
  result: ValidationResult | null
}>()

const emit = defineEmits<{
  back: []
  commit: []
}>()
</script>

<template>
  <div class="rounded border border-slate-200 bg-white">
    <div class="border-b border-slate-100 px-5 py-4">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Validation results
      </p>
    </div>

    <div v-if="!result" class="px-5 py-10 text-center text-sm text-slate-400">
      Running validation…
    </div>

    <div v-else>
      <div class="grid grid-cols-3 gap-4 px-5 py-6">
        <div class="relative flex w-full flex-col items-start rounded border border-slate-200 bg-white p-6">
          <p class="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Valid rows</p>
          <p class="mt-4 text-4xl font-extrabold tracking-tight text-green-600">{{ result.validRows.toLocaleString() }}</p>
        </div>
        <div class="relative flex w-full flex-col items-start rounded border border-slate-200 bg-white p-6">
          <p class="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Warnings</p>
          <p class="mt-4 text-4xl font-extrabold tracking-tight text-amber-600">{{ result.issues.filter(i => i.type === 'warning').length }}</p>
        </div>
        <div class="relative flex w-full flex-col items-start rounded border border-slate-200 bg-white p-6">
          <p class="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Errors (skipped)</p>
          <p class="mt-4 text-4xl font-extrabold tracking-tight text-red-600">{{ result.issues.filter(i => i.type === 'error').length }}</p>
        </div>
      </div>

      <DataTableWrapper
        v-if="result.issues.length"
        :data="result.issues"
        :bordered="false"
        :row-key="(row: any) => `${row.row}-${row.column}`"
        empty-text="No issues found"
        empty-description="All rows passed validation"
      >
        <el-table-column label="Row" width="80">
          <template #default="{ row }">
            <span class="text-xs text-slate-700">{{ row.row }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Issue" width="120">
          <template #default="{ row }">
            <span
              class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
              :class="row.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ row.type === 'error' ? 'Error' : 'Warning' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Detail" min-width="300">
          <template #default="{ row }">
            <span class="text-xs text-slate-600">{{ row.message }}</span>
          </template>
        </el-table-column>
      </DataTableWrapper>
    </div>

    <div class="flex items-center justify-between px-5 py-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
        @click="emit('back')"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 16V4" />
          <path d="M8 12l4 4 4-4" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        Download error report
      </button>
      <div class="flex gap-2">
        <BaseButton variant="secondary" @click="emit('back')">
          ‹ Back
        </BaseButton>
        <BaseButton :disabled="!result" @click="emit('commit')">
          Commit {{ result?.validRows.toLocaleString() }} rows ›
        </BaseButton>
      </div>
    </div>
  </div>
</template>