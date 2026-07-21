<script setup lang="ts">
import type { Rule } from '../service/useSubjects'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  rules: Rule[]
  saving: boolean
}>()

const emit = defineEmits<{
  'update:rule': [index: number, field: keyof Rule, value: any]
  'remove': [index: number]
  'add': []
}>()

const signOptions = [
  { value: '+', label: 'Add (+)' },
  { value: '-', label: 'Subtract (-)' },
  { value: '*', label: 'Multiply (*)' },
  { value: '%', label: 'Percentage (%)' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

function updateRule(index: number, field: keyof Rule, value: any) {
  emit('update:rule', index, field, value)
}

function removeRule(index: number) {
  emit('remove', index)
}

function addRule() {
  emit('add')
}
</script>

<template>
  <!-- With rules -->
  <TransitionGroup
    v-if="rules && rules.length > 0"
    tag="div"
    name="rule-card"
    class="space-y-3"
  >
    <div
      v-for="(rule, index) in rules"
      :key="rule.id || `rule-${index}`"
      class="group rounded border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
    >
      <!-- Top row: name + remove button -->
      <div class="mb-3 flex items-start gap-2">
        <div class="flex-1 min-w-0">
          <label class="mb-1 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Rule Name
          </label>
          <input
            :value="rule.name"
            type="text"
            :disabled="saving"
            placeholder="e.g., Late Submission Penalty"
            class="w-full rounded border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-sm font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-1 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            @input="updateRule(index, 'name', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <BaseButton
          variant="outline"
          size="small"
          :disabled="saving"
          class="!w-auto !border-transparent !text-red-400 transition-all duration-200 hover:!border-red-200 hover:!bg-red-50 hover:!text-red-600"
          title="Remove rule"
          @click="removeRule(index)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </BaseButton>
      </div>

      <!-- Bottom row: operation, value, status, description -->
      <div class="space-y-3">
        <div class="grid grid-cols-12 gap-3">
          <div class="col-span-4">
            <BaseSelect
              :model-value="rule.sign"
              label="Operation"
              :options="signOptions"
              :disabled="saving"
              @update:model-value="updateRule(index, 'sign', $event)"
            />
          </div>
          <div class="col-span-4">
            <BaseInput
              :model-value="String(rule.value)"
              label="Value"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.5"
              :disabled="saving"
              @update:model-value="updateRule(index, 'value', Number($event))"
            />
          </div>
          <div class="col-span-4">
            <BaseSelect
              :model-value="rule.status"
              label="Status"
              :options="statusOptions"
              :disabled="saving"
              @update:model-value="updateRule(index, 'status', $event)"
            />
          </div>
        </div>
        <div>
          <BaseInput
            :model-value="rule.desc || ''"
            placeholder="Add a description (optional)"
            :disabled="saving"
            @update:model-value="updateRule(index, 'desc', $event)"
          />
        </div>
      </div>
    </div>
  </TransitionGroup>

  <!-- No rules (empty state) -->
  <div
    v-else
    class="flex flex-col items-center justify-center rounded border-2 border-dashed border-slate-200 bg-slate-50/50 px-5 py-6 text-center transition-colors duration-200 hover:border-slate-300 hover:bg-slate-100/50"
  >
    <div class="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-slate-400"
      >
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <p class="text-sm font-medium text-slate-600">No deduction rules configured</p>
    <p class="mt-0.5 mb-3 text-xs text-slate-400">Add rules to define score adjustments like penalties or bonuses</p>
    <BaseButton
      variant="outline"
      size="small"
      :disabled="saving"
      class="!w-auto"
      @click="addRule"
    >
      <span class="flex items-center gap-1.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add First Rule
      </span>
    </BaseButton>
  </div>
</template>

<style scoped>
.rule-card-enter-active {
  transition: all 0.3s ease-out;
}
.rule-card-leave-active {
  transition: all 0.2s ease-in;
}
.rule-card-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
.rule-card-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}
.rule-card-move {
  transition: transform 0.25s ease;
}
</style>
