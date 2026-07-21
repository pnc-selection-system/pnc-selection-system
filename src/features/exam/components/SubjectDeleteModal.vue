<script setup lang="ts">
import type { Subject } from '../service/useSubjects'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  modelValue: boolean
  subject: Subject | null
  deleting: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function closeModal() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Delete Subject"
    width="440px"
    @update:model-value="closeModal"
  >
    <div v-if="subject" class="space-y-4">
      <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-red-600"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-800">
            Delete "{{ subject.name }}"?
          </p>
          <p class="mt-1 text-xs text-slate-500">
            This action cannot be undone. The subject will be soft-deleted and removed from the list.
          </p>
        </div>
      </div>
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="error"
          class="rounded border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700"
        >
          {{ error }}
        </div>
      </Transition>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          variant="secondary"
          :disabled="deleting"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="danger"
          :disabled="deleting"
          :loading="deleting"
          @click="$emit('confirm')"
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
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            Delete
          </span>
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
