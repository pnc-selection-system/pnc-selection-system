<script setup lang="ts">
import type { DashboardFilters, FilterOptions } from '../types/filter'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { SelectOption } from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  modelValue: DashboardFilters
  options: FilterOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DashboardFilters]
  export: []
}>()

function update<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function mapOptions(items: string[], prefix: string): SelectOption[] {
  return items.map((item) => ({ value: item, label: `${prefix}: ${item}` }))
}
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.campaign"
          :options="mapOptions(options.campaigns, 'Campaign')"
          placeholder="Select campaign"
          clearable
          @update:model-value="update('campaign', $event)"
        />
      </div>

      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.province"
          :options="mapOptions(options.provinces, 'Province')"
          placeholder="Select province"
          clearable
          @update:model-value="update('province', $event)"
        />
      </div>

      <div class="w-40">
        <BaseSelect
          :model-value="modelValue.status"
          :options="mapOptions(options.statuses, 'Status')"
          placeholder="Select status"
          clearable
          @update:model-value="update('status', $event)"
        />
      </div>
    </div>

    <BaseButton
      type="button"
      variant="secondary"
      class="!w-auto gap-1.5"
      @click="emit('export')"
    >
      Export view
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
        <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </BaseButton>
  </div>
</template>
