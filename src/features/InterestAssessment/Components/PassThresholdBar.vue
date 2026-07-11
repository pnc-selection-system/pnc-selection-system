<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  save: []
}>()

function handleInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace('%', '')
  emit('update:modelValue', Number(raw) || 0)
}

function handleSaveClick() {
  console.log('PassThresholdBar: Save button clicked!')
  emit('save')
}
</script>

<template>
  <div class="mt-4 flex items-end justify-between">
    <div>
      <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        Pass threshold
      </label>
      <div class="relative mt-1.5 w-28">
        <input
          type="text"
          :value="`${modelValue}%`"
          class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          @input="handleInput"
        />
      </div>
    </div>

    <button
      type="button"
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
      style="position: relative; z-index: 9999;"
      @click="handleSaveClick"
    >
      Save form
    </button>
  </div>
</template>