<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { ValidationResult, SubjectRule } from '../types/mapping'

const props = defineProps<{
  result: ValidationResult | null
  subjectRules?: SubjectRule[]
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
      <div class="flex items-center justify-center gap-2">
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
        Running validation…
      </div>
    </div>

    <div v-else>
      <!-- Stats summary -->
      <div class="grid grid-cols-4 gap-4 border-b border-slate-100 px-5 py-4">
        <div class="rounded border border-slate-100 bg-slate-50 p-4">
          <p class="text-xs text-slate-400">Total rows</p>
          <p class="text-2xl font-semibold text-slate-700">{{ result.totalRows.toLocaleString() }}</p>
        </div>
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

      <!-- Subject rules info -->
      <div v-if="subjectRules && subjectRules.length > 0" class="border-b border-slate-100 px-5 py-4">
        <p class="mb-2 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Scoring rules for this subject
        </p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="rule in subjectRules"
            :key="rule.name"
            class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs"
            :class="rule.sign === '+' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'"
          >
            <span class="font-mono text-sm font-bold">{{ rule.sign }}</span>
            <span class="font-medium">{{ rule.name }}</span>
            <span class="opacity-75">({{ rule.value }} pts)</span>
          </div>
        </div>
      </div>

      <!-- Issues table -->
      <div v-if="result.issues.length" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-y border-slate-100 bg-slate-50">
              <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Row</th>
              <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Column</th>
              <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Type</th>
              <th class="px-5 py-2.5 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Detail</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(issue, i) in result.issues"
              :key="`${issue.row}-${issue.column}-${i}`"
              class="border-b border-slate-50 last:border-0"
            >
              <td class="px-5 py-2.5 font-mono text-slate-700">{{ issue.row }}</td>
              <td class="px-5 py-2.5 text-slate-600">{{ issue.column }}</td>
              <td class="px-5 py-2.5">
                <span
                  class="inline-block rounded px-2 py-0.5 text-xs font-medium"
                  :class="issue.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ issue.type === 'error' ? 'Error' : 'Info' }}
                </span>
              </td>
              <td class="px-5 py-2.5 text-slate-600">{{ issue.message }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else class="px-5 py-8 text-center">
        <div class="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm text-green-700">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
          </svg>
          All rows passed validation
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between border-t border-slate-100 px-5 py-4">
      <button
        type="button"
        class="text-sm text-slate-500 hover:text-slate-700"
        @click="emit('back')"
      >
        ← Back to mapping
      </button>
      <div class="flex gap-2">
        <BaseButton variant="secondary" @click="emit('back')">
          ‹ Back
        </BaseButton>
        <BaseButton
          :disabled="!result || result.issues.filter(i => i.type === 'error').length > 0"
          @click="emit('commit')"
        >
          Commit {{ result?.validRows.toLocaleString() }} rows ›
        </BaseButton>
      </div>
    </div>
  </div>
</template>
