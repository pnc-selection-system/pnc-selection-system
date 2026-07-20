<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    type?: string
    placeholder?: string
    name?: string
    id?: string
    disabled?: boolean
    rows?: number
    min?: string
    max?: string
  }>(),
  {
    rows: 4,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id || name" class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">{{ label }}</label>
    <textarea
      v-if="type === 'textarea'"
      :id="id || name"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :rows="rows"
      class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :id="id || name"
      :name="name"
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :min="min"
      :max="max"
      class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
