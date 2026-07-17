<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  save: []
}>()

function handleInput(value: string) {
  const raw = value.replace('%', '')
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
        <BaseInput
          :model-value="`${modelValue}%`"
          @update:model-value="handleInput"
        />
      </div>
    </div>

    <BaseButton class="!w-auto" @click="handleSaveClick">
      Save form
    </BaseButton>
  </div>
</template>