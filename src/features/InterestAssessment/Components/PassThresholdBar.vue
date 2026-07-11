<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

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

    <BaseButton class="!w-auto" @click="handleSaveClick">
      Save form
    </BaseButton>
  </div>
</template>