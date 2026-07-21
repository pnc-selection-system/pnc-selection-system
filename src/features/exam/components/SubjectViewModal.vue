<script setup lang="ts">
import type { Subject } from '../service/useSubjects'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  modelValue: boolean
  subject: Subject | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Subject Details"
    width="520px"
    @update:model-value="closeModal"
  >
    <div v-if="subject" class="space-y-5">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded bg-blue-50">
          <span class="text-sm font-bold text-blue-600">
            {{ subject.name.charAt(0) }}
          </span>
        </div>
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Subject Name
          </p>
          <p class="mt-0.5 text-sm font-semibold text-slate-800">
            {{ subject.name }}
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded border border-slate-100 bg-slate-50/50 p-4">
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Max Score
          </p>
          <p class="mt-1.5 text-lg font-bold text-slate-800 tabular-nums">
            {{ subject.maxScore }}
          </p>
        </div>
        <div class="rounded border border-slate-100 bg-slate-50/50 p-4">
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Weight
          </p>
          <p class="mt-1.5 text-lg font-bold text-blue-600 tabular-nums">
            {{ subject.weight }}%
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="closeModal"
        >
          Close
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
