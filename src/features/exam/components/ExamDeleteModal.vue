<script setup lang="ts">
import { computed } from 'vue'
import type { Exam } from '../types'
import { useExams } from '../service/useExams'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  exam: Exam | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { deleteExam } = useExams()

const visible = computed(() => !!props.exam)

function handleDelete(id: string) {
  deleteExam(id)
  emit('close')
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="visible"
    width="420px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <div class="py-2 text-center">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 class="mb-1 text-base font-semibold text-slate-900">Delete Exam</h3>
      <p v-if="exam" class="text-sm text-slate-500">
        Are you sure you want to delete
        <strong class="text-slate-700">"{{ exam.name }}"</strong>?
        This action cannot be undone.
      </p>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-2">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded-md !px-4 !py-2"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          v-if="exam"
          variant="primary"
          class="!w-auto !rounded-md !bg-rose-500 !border-rose-500 hover:!bg-rose-600 !px-4 !py-2"
          autofocus
          @click="handleDelete(exam.id)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Delete
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
