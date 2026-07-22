<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  modelValue: number
  saving?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  save: []
}>()

const showSuccess = ref(false)

function handleInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace('%', '')
  emit('update:modelValue', Number(raw) || 0)
}

function handleSaveClick() {
  emit('save')
}

// When saving transitions from true → false, briefly flash green
watch(
  () => props.saving,
  (curr, prev) => {
    if (prev === true && curr === false) {
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 1800)
    }
  },
)
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

    <BaseButton
      :loading="saving"
      :class="{ 'save-success': showSuccess }"
      :disabled="saving"
      @click="handleSaveClick"
    >
      <template v-if="showSuccess">✓ Saved</template>
      <template v-else>Save form</template>
    </BaseButton>
  </div>
</template>

<style scoped>
.save-success {
  --el-button-bg-color: #059669;
  --el-button-border-color: #059669;
  --el-button-hover-bg-color: #047857;
  --el-button-hover-border-color: #047857;
  --el-button-text-color: #fff;
}
</style>