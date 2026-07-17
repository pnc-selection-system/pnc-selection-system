<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Exam } from '../types'
import { useExams } from '../service/useExams'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const props = defineProps<{
  exam: Exam | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { deleteExam } = useExams()

const visible = computed(() => !!props.exam)
const isDeleting = ref(false)
const confirmMessage = computed(() => {
  if (!props.exam) return ''
  return `Are you sure you want to delete "${props.exam.name}"? This action cannot be undone.`
})

function handleDelete() {
  if (!props.exam) return
  isDeleting.value = true
  deleteExam(props.exam.id)
  isDeleting.value = false
  emit('close')
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <ConfirmDialog
    :model-value="visible"
    title="Delete Exam"
    :message="confirmMessage"
    confirm-text="Delete"
    cancel-text="Cancel"
    :loading="isDeleting"
    @confirm="handleDelete"
    @cancel="handleCancel"
    @update:model-value="handleCancel"
  />
</template>
