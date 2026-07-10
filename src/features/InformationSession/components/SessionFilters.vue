<script setup lang="ts">
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { SelectOption } from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import type { SessionFilterOptions, SessionFilters } from '../types/filter'

const props = defineProps<{
  modelValue: SessionFilters
  options: SessionFilterOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFilters]
  new: []
}>()

function update<K extends keyof SessionFilters>(key: K, value: SessionFilters[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function mapOptions(items: string[], prefix: string): SelectOption[] {
  return [
    { value: '', label: `${prefix}: All` },
    ...items.filter(i => i !== 'All').map(i => ({ value: i, label: `${prefix}: ${i}` })),
  ]
}
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.province"
          :options="mapOptions(options.provinces, 'Province')"
          placeholder="Province"
          clearable
          @update:model-value="(v: string | number) => update('province', v as string)"
        />
      </div>

      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.school"
          :options="mapOptions(options.schools, 'School')"
          placeholder="School"
          clearable
          @update:model-value="(v: string | number) => update('school', v as string)"
        />
      </div>

      <div class="w-44">
        <BaseSelect
          :model-value="modelValue.dateRange"
          :options="mapOptions(options.dateRanges, 'Date')"
          placeholder="Date range"
          clearable
          @update:model-value="(v: string | number) => update('dateRange', v as string)"
        />
      </div>
    </div>

    <BaseButton
      variant="primary"
      class="!w-auto !rounded-[4px] !px-4 !py-2 text-sm font-semibold"
      @click="emit('new')"
    >
      <BaseIcon :size="14" :stroke-width="2.5">
        <path d="M12 5v14M5 12h14" />
      </BaseIcon>
      New session
    </BaseButton>
  </div>
</template>
