<script setup lang="ts">
defineProps<{
  modelValue: 'builder' | 'record'
}>()

defineEmits<{
  'update:modelValue': [value: 'builder' | 'record']
}>()

const tabs: { key: 'builder' | 'record'; label: string }[] = [
  { key: 'builder', label: 'Form builder' },
  { key: 'record', label: 'Record response' },
]
</script>

<template>
  <div class="flex gap-6 border-b border-slate-200">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="border-b-2 pb-3 text-sm font-medium transition"
      :class="
        modelValue === tab.key
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      "
      @click="$emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>