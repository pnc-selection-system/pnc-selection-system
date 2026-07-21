<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Subject } from '../service/useSubjects'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import SubjectFormFields from './SubjectFormFields.vue'

const props = defineProps<{
  visible: boolean
  subject: Subject | null
  saving?: boolean
  serverError?: string | null
  subjects: Subject[]
}>()

const emit = defineEmits<{
  close: []
  save: [data: { name: string; maxScore: number; weight: number }]
}>()

const isEditing = ref(false)
const form = ref<Omit<Subject, 'id'>>({
  name: '',
  maxScore: 100,
  weight: 0,
})
const errors = ref<Record<string, string>>({})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      errors.value = {}
      if (props.subject) {
        isEditing.value = true
        form.value = {
          name: props.subject.name,
          maxScore: props.subject.maxScore,
          weight: props.subject.weight,
        }
      } else {
        isEditing.value = false
        form.value = {
          name: '',
          maxScore: 100,
          weight: 0,
        }
      }
    }
  },
)

function isDuplicateName(name: string, excludeId?: number): boolean {
  const trimmedName = name.trim().toLowerCase()
  return props.subjects.some(
    (s) => s.id !== excludeId && s.name.toLowerCase() === trimmedName,
  )
}

function isValidName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim()
  if (!trimmed) return { valid: false, error: 'Subject name is required' }
  const nameRegex = /^[a-zA-Z\s\-_&]+$/
  if (!nameRegex.test(trimmed)) return { valid: false, error: 'Subject name can only contain letters, spaces, hyphens, and underscores (no numbers)' }
  if (trimmed.length < 2) return { valid: false, error: 'Subject name must be at least 2 characters' }
  if (trimmed.length > 50) return { valid: false, error: 'Subject name must be less than 50 characters' }
  return { valid: true }
}

const nameStatus = computed(() => {
  if (!form.value.name) return 'empty'
  const validation = isValidName(form.value.name)
  if (!validation.valid) return 'invalid'
  if (isDuplicateName(form.value.name, props.subject?.id)) return 'duplicate'
  return 'valid'
})

const nameStatusMessage = computed(() => {
  if (nameStatus.value === 'duplicate') return 'A subject with this name already exists'
  if (nameStatus.value === 'invalid') {
    const validation = isValidName(form.value.name)
    return validation.error || 'Invalid name'
  }
  return ''
})

function validate(): boolean {
  errors.value = {}

  // Validate name
  const nameTrimmed = form.value.name.trim()
  if (!nameTrimmed) {
    errors.value.name = 'Subject name is required'
  } else if (typeof nameTrimmed !== 'string') {
    errors.value.name = 'Subject name must be a string'
  } else {
    const nameRegex = /^[a-zA-Z\s\-_&]+$/
    if (!nameRegex.test(nameTrimmed)) {
      errors.value.name = 'Subject name can only contain letters, spaces, hyphens, and underscores (no numbers)'
    } else if (nameTrimmed.length < 2) {
      errors.value.name = 'Subject name must be at least 2 characters'
    } else if (nameTrimmed.length > 50) {
      errors.value.name = 'Subject name must be less than 50 characters'
    } else if (isDuplicateName(nameTrimmed, props.subject?.id)) {
      errors.value.name = 'A subject with this name already exists'
    }
  }

  // Validate maxScore
  if (!form.value.maxScore || form.value.maxScore <= 0) {
    errors.value.maxScore = 'Max score must be greater than 0'
  }

  // Validate weight
  if (form.value.weight < 0 || form.value.weight > 100) {
    errors.value.weight = 'Weight must be between 0 and 100'
  }

  return Object.keys(errors.value).length === 0
}

function saveSubject() {
  if (!validate()) return
  emit('save', {
    name: form.value.name.trim(),
    maxScore: form.value.maxScore,
    weight: form.value.weight,
  })
}

function closeModal() {
  form.value = {
    name: '',
    maxScore: 100,
    weight: 0,
  }
  errors.value = {}
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="visible"
    :title="isEditing ? 'Edit Subject' : 'Add New Subject'"
    width="560px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <form @submit.prevent="saveSubject">
      <SubjectFormFields
        :form="form"
        :errors="errors"
        :name-status="nameStatus"
        :name-status-message="nameStatusMessage"
        :saving="saving"
        :server-error="serverError"
        @update:name="form.name = $event"
        @update:max-score="form.maxScore = $event"
        @update:weight="form.weight = $event"
      />
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          variant="secondary"
          :disabled="saving"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          :disabled="nameStatus === 'duplicate' || nameStatus === 'invalid' || saving"
          :loading="saving"
          @click="saveSubject"
        >
          {{ isEditing ? 'Save Changes' : 'Add Subject' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
