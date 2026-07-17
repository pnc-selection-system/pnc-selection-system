<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Subject } from '../service/useSubjects'
import { useSubjects } from '../service/useSubjects'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const props = defineProps<{
  visible: boolean
  subject: Subject | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { addSubject, updateSubject, isDuplicateName, isValidName } = useSubjects()

const isEditing = ref(false)
const form = ref<Omit<Subject, 'id'>>({
  name: '',
  maxScore: 100,
  weight: 0,
  deductionRule: 'none',
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
          deductionRule: props.subject.deductionRule,
        }
      } else {
        isEditing.value = false
        form.value = {
          name: '',
          maxScore: 100,
          weight: 0,
          deductionRule: 'none',
        }
      }
    }
  },
)

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

  // Validate name (string only)
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

  if (isEditing.value && props.subject) {
    updateSubject({
      id: props.subject.id,
      name: form.value.name.trim(),
      maxScore: form.value.maxScore,
      weight: form.value.weight,
      deductionRule: form.value.deductionRule,
    })
  } else {
    addSubject({
      name: form.value.name.trim(),
      maxScore: form.value.maxScore,
      weight: form.value.weight,
      deductionRule: form.value.deductionRule,
    })
  }
  
  emit('saved')
  closeModal()
}

function closeModal() {
  form.value = {
    name: '',
    maxScore: 100,
    weight: 0,
    deductionRule: 'none',
  }
  errors.value = {}
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="visible"
    :title="isEditing ? 'Edit Subject' : 'Add New Subject'"
    width="480px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <form @submit.prevent="saveSubject">
      <div class="space-y-5">
        <!-- Subject Name -->
        <div>
          <label for="subjectName" class="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Subject Name <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <input
              id="subjectName"
              v-model="form.name"
              type="text"
              :class="[
                'w-full rounded border px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400',
                errors.name
                  ? 'border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                  : nameStatus === 'duplicate'
                    ? 'border-amber-300 bg-amber-50/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-100'
                    : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
              ]"
              placeholder="e.g., Mathematics, Physics"
              maxlength="50"
            />
            <div
              v-if="form.name && !errors.name"
              :class="[
                'absolute right-3 top-1/2 -translate-y-1/2',
                nameStatus === 'valid' ? 'text-emerald-500' : '',
                nameStatus === 'duplicate' ? 'text-amber-500' : '',
              ]"
            >
              <svg
                v-if="nameStatus === 'valid'"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <svg
                v-else-if="nameStatus === 'duplicate'"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <p v-if="errors.name" class="mt-1.5 text-xs text-rose-500">{{ errors.name }}</p>
          <p v-else-if="nameStatusMessage" class="mt-1.5 text-xs text-amber-600">{{ nameStatusMessage }}</p>
          <p v-else class="mt-1 text-xs text-slate-400">Only letters, spaces, hyphens and underscores (no numbers)</p>
        </div>

        <!-- Max Score -->
        <div>
          <label for="maxScore" class="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Max Score <span class="text-rose-500">*</span>
          </label>
          <input
            id="maxScore"
            v-model.number="form.maxScore"
            type="number"
            min="1"
            max="1000"
            :class="[
              'w-full rounded border px-3 py-2.5 text-sm outline-none transition',
              errors.maxScore
                ? 'border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
            ]"
            placeholder="100"
          />
          <p v-if="errors.maxScore" class="mt-1.5 text-xs text-rose-500">{{ errors.maxScore }}</p>
        </div>

        <!-- Weight -->
        <div>
          <label for="weight" class="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
            Weight <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <input
              id="weight"
              v-model.number="form.weight"
              type="number"
              min="0"
              max="100"
              :class="[
                'w-full rounded-lg border px-3 py-2.5 pr-8 text-sm outline-none transition',
                errors.weight
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
              ]"
              placeholder="0"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
          </div>
          <p v-if="errors.weight" class="mt-1.5 text-xs text-rose-500">{{ errors.weight }}</p>
        </div>

        <!-- Deduction Rule -->
        <BaseSelect
          v-model="form.deductionRule"
          label="Deduction Rule"
          :options="[
            { value: 'none', label: 'None' },
            { value: '-0.25 / wrong', label: '-0.25 per wrong answer' },
            { value: '-0.5 / wrong', label: '-0.5 per wrong answer' },
            { value: '-1 / wrong', label: '-1 per wrong answer' },
          ]"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2 !text-sm"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          class="!w-auto !rounded !px-4 !py-2 !text-sm"
          :disabled="nameStatus === 'duplicate' || nameStatus === 'invalid'"
          @click="saveSubject"
        >
          {{ isEditing ? 'Save Changes' : 'Add Subject' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
