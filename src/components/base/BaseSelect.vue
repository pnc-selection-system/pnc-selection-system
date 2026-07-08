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
    <label v-if="label" :for="id || name" class="text-sm text-slate-600">{{ label }}</label>
    <el-select
      :id="id || name"
      :model-value="modelValue"
      :placeholder="placeholder || 'Select...'"
      :disabled="disabled"
      :clearable="clearable"
      class="w-full"
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
  </div>
</template>
