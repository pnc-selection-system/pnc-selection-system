<script setup lang="ts">
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue?: string | number
  options?: SelectOption[] | string[]
  label?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  name?: string
  id?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

function normalizedOptions(): SelectOption[] {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
}

function handleChange(value: string | number) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id || name" class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">{{ label }}</label>
    <div class="base-select-wrap" style="position: relative;">
      <el-select
        :id="id || name"
        :model-value="modelValue"
        :placeholder="placeholder || 'Select..'"
        :disabled="disabled"
        :clearable="clearable"
        class="w-full base-select-el"
        @update:model-value="handleChange"
      >
        <el-option
          v-for="opt in normalizedOptions()"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
          :disabled="opt.disabled"
        />
      </el-select>
      <span
        class="base-select-arrow"
        style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #64748b; line-height: 1; pointer-events: none; z-index: 100;"
      >▾</span>
    </div>
  </div>
</template>

<style>
.base-select-el .el-select__suffix .el-select__caret {
  display: none !important;
}
</style>
