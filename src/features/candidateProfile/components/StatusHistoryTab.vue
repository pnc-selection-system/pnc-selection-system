<script setup lang="ts">
import type { Candidate } from '../types/index'
import { statusConfigs } from '../types/index'

defineProps<{
  candidate: Candidate
}>()

const mockHistory = [
  { date: '2025-06-10', from: 'pending', to: 'investigating', by: 'Mr. Vuthy', note: 'Initial review completed' },
  { date: '2025-06-05', from: null, to: 'pending', by: 'System', note: 'Candidate registered' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-lg border border-slate-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50">
            <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
              Date
            </th>
            <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
              From
            </th>
            <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
              To
            </th>
            <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
              Changed By
            </th>
            <th class="px-4 py-3 text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
              Note
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="(item, index) in mockHistory" :key="index" class="hover:bg-slate-50">
            <td class="px-4 py-3 text-xs text-slate-600">{{ item.date }}</td>
            <td class="px-4 py-3">
              <span
                v-if="item.from"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :style="{
                  backgroundColor: statusConfigs[item.from as keyof typeof statusConfigs]?.bg,
                  color: statusConfigs[item.from as keyof typeof statusConfigs]?.text,
                }"
              >
                {{ statusConfigs[item.from as keyof typeof statusConfigs]?.label }}
              </span>
              <span v-else class="text-xs text-slate-400">—</span>
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :style="{
                  backgroundColor: statusConfigs[item.to as keyof typeof statusConfigs]?.bg,
                  color: statusConfigs[item.to as keyof typeof statusConfigs]?.text,
                }"
              >
                {{ statusConfigs[item.to as keyof typeof statusConfigs]?.label }}
              </span>
            </td>
            <td class="px-4 py-3 text-xs text-slate-600">{{ item.by }}</td>
            <td class="px-4 py-3 text-xs text-slate-600">{{ item.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
