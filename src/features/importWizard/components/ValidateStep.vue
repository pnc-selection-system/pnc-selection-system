<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
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
      <div class="grid grid-cols-3 gap-4 px-5 py-4">
        <div class="rounded border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs text-slate-400">Valid rows</p>
          <p class="text-2xl font-semibold text-green-600">{{ result.validRows.toLocaleString() }}</p>
        </div>
        <div class="rounded border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs text-slate-400">Warnings</p>
          <p class="text-2xl font-semibold text-amber-600">{{ result.issues.filter(i => i.type === 'warning').length }}</p>
        </div>
        <div class="rounded border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs text-slate-400">Errors (skipped)</p>
          <p class="text-2xl font-semibold text-red-600">{{ result.issues.filter(i => i.type === 'error').length }}</p>
        </div>
      </div>

      <table v-if="result.issues.length" class="w-full text-sm">
        <thead>
          <tr class="border-y border-slate-100 bg-slate-50">
            <th class="px-5 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Row</th>
            <th class="px-5 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Issue</th>
            <th class="px-5 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="issue in result.issues" :key="`${issue.row}-${issue.column}`" class="border-b border-slate-50 last:border-0">
            <td class="px-5 py-2.5 text-slate-700">{{ issue.row }}</td>
            <td class="px-5 py-2.5">
              <span class="rounded px-2 py-0.5 text-xs font-medium" :class="issue.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'">
                {{ issue.type === 'error' ? 'Error' : 'Warning' }}
              </span>
            </td>
            <td class="px-5 py-2.5 text-slate-600">{{ issue.message }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between px-5 py-4">
      <button
        type="button"
        class="text-sm text-slate-600 hover:text-slate-800"
        @click="emit('back')"
      >
        ↓ Download error report
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