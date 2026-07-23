<script setup lang="ts">
import type { InvestigationHistory } from '../types/investigation'

defineProps<{
  history: InvestigationHistory[]
}>()

const actionColors: Record<string, string> = {
  Created: 'bg-blue-500',
  Updated: 'bg-slate-500',
  Submitted: 'bg-orange-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flow-root">
    <ul class="-mb-8">
      <li v-for="(item, index) in history" :key="item.id">
        <div class="relative pb-8">
          <span
            v-if="index !== history.length - 1"
            class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
            aria-hidden="true"
          ></span>
          <div class="relative flex space-x-3">
            <div>
              <span
                class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                :class="actionColors[item.action]"
              >
                <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
              <div>
                <p class="text-sm text-slate-700">
                  <span class="font-medium">{{ item.action }}</span>
                  by <span class="font-medium">{{ item.userName }}</span>
                </p>
                <p v-if="item.notes" class="mt-1 text-sm text-slate-500">{{ item.notes }}</p>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-slate-500">
                {{ formatDate(item.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>