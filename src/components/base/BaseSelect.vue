<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue?: string | number | (string | number)[]
  options?: SelectOption[] | string[]
  label?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
  loading?: boolean
  name?: string
  id?: string
  teleported?: boolean
  popperClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
  (e: 'change', value: string | number | (string | number)[]): void
}>()

const normalizedOptions = computed<SelectOption[]>(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
})

function handleChange(value: unknown) {
  emit('update:modelValue', value as string | number | (string | number)[])
  emit('change', value as string | number | (string | number)[])
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id || name" class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">{{ label }}</label>
    <div class="base-select-wrap">
      <el-select
        :id="id || name"
        :model-value="modelValue"
        :placeholder="placeholder || 'Select..'"
        :disabled="disabled"
        :clearable="clearable"
        :multiple="multiple"
        :loading="loading"
        :teleported="teleported ?? true"
        :popper-class="['base-select-popper', popperClass].filter(Boolean).join(' ')"
        class="w-full"
        @update:model-value="handleChange"
      >
        <el-option
          v-for="opt in normalizedOptions"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
          :disabled="opt.disabled"
        />
      </el-select>
    </div>
  </div>
</template>

<style>
.base-select-popper {
  z-index: 9999 !important;
}
</style>
