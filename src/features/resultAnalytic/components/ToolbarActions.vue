<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { ExamRound, PublishStatus } from '../types/results'

const props = defineProps<{
  rounds: ExamRound[]
  modelValue: string
  status: PublishStatus
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  export: []
  publishLock: []
}>()

const statusLabel = computed(() => (props.status === 'draft' ? 'Draft — not published' : 'Published & locked'))
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function selectRound(roundId: string) {
  emit('update:modelValue', roundId)
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div ref="dropdownRef" class="relative">
        <BaseButton variant="secondary" class="!pr-10" @click="isDropdownOpen = !isDropdownOpen">
          {{ rounds.find((r) => r.id === modelValue)?.label ?? 'Select round' }}
          <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </BaseButton>
        
        <div v-if="isDropdownOpen" class="absolute top-full left-0 z-50 mt-1 w-full rounded border border-slate-200 bg-white py-1 shadow-lg">
          <button
            v-for="round in rounds"
            :key="round.id"
            type="button"
            class="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50"
            :class="round.id === modelValue ? 'font-semibold text-blue-600' : 'text-slate-700'"
            @click.prevent="selectRound(round.id)"
          >
            {{ round.label }}
          </button>
        </div>
      </div>

      <BaseButton variant="secondary" disabled>
        {{ statusLabel }}
      </BaseButton>
    </div>

    <div class="flex items-center gap-2">
      <BaseButton variant="secondary" @click="emit('export')">
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
          <path d="M10 3v10m0 0-3.5-3.5M10 13l3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M4 15.5h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Export
      </BaseButton>

      <BaseButton :disabled="status === 'published'" @click="emit('publishLock')">
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
          <rect x="4.5" y="9" width="11" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        {{ status === 'published' ? 'Published & locked' : 'Publish & lock results' }}
      </BaseButton>
    </div>
  </div>
</template>