<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { ScoreDistribution } from '../types/results'

const props = defineProps<{
  distribution: ScoreDistribution
  provinces: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const maxCount = computed(() => Math.max(...props.distribution.buckets.map((b) => b.count), 1))
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

function selectProvince(province: string) {
  emit('update:modelValue', province)
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-5">
    <div class="flex items-center justify-between">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Score distribution
      </p>
      <div ref="dropdownRef" class="relative">
        <BaseButton variant="secondary" class="!pr-10" @click="isDropdownOpen = !isDropdownOpen">
          {{ modelValue }}
          <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </BaseButton>
        
        <div v-if="isDropdownOpen" class="absolute top-full left-0 z-50 mt-1 w-full rounded border border-slate-200 bg-white py-1 shadow-lg">
          <button
            v-for="province in provinces"
            :key="province"
            type="button"
            class="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50"
            :class="province === modelValue ? 'font-semibold text-blue-600' : 'text-slate-700'"
            @click.stop.prevent="selectProvince(province)"
          >
            {{ province }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6 flex h-44 items-end gap-3">
      <div
        v-for="bucket in distribution.buckets"
        :key="bucket.rangeLabel"
        class="flex h-full flex-1 flex-col items-center justify-end"
      >
        <div
          class="w-full rounded-t"
          :class="bucket.isModal ? 'bg-blue-200' : 'bg-slate-200'"
          :style="{ height: `${(bucket.count / maxCount) * 100}%` }"
        />
      </div>
    </div>

    <p class="mt-3 text-center font-mono text-xs text-slate-400">
      avg {{ distribution.avg }} · median {{ distribution.median }} · pass line at {{ distribution.passLine }}
      (blue bar = modal bin)
    </p>
  </div>
</template>