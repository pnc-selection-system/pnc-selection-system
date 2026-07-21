<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Subject, Rule } from '../service/useSubjects'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import SubjectFormFields from './SubjectFormFields.vue'
import RuleFormFields from './RuleFormFields.vue'

const props = defineProps<{
  visible: boolean
  subject: Subject | null
  saving?: boolean
  serverError?: string | null
  subjects: Subject[]
}>()

const emit = defineEmits<{
  close: []
  save: [data: { name: string; maxScore: number; weight: number; rules?: Rule[] }]
}>()

const isEditing = ref(false)
const form = ref<Omit<Subject, 'id'>>({
  name: '',
  maxScore: 100,
  weight: 0,
  rules: [],
})
const errors = ref<Record<string, string>>({})

// Ensure rules array is always initialized
watch(() => form.value.rules, (newRules) => {
  if (!newRules) {
    form.value.rules = []
  }
}, { immediate: true })

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
          rules: props.subject.rules ? [...props.subject.rules] : [],
        }
      } else {
        isEditing.value = false
        form.value = {
          name: '',
          maxScore: 100,
          weight: 0,
          rules: [],
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
  } else if (isDuplicateName(nameTrimmed, props.subject?.id)) {
    errors.value.name = 'A subject with this name already exists'
  }

  // Validate maxScore
  if (!form.value.maxScore || form.value.maxScore <= 0) {
    errors.value.maxScore = 'Max score must be greater than 0'
  }

  // Validate weight
  if (form.value.weight < 0 || form.value.weight > 100) {
    errors.value.weight = 'Weight must be between 0 and 100'
  }

  // Validate total weight across all subjects does not exceed 100%
  if (!errors.value.weight) {
    const otherSubjectsTotal = isEditing.value && props.subject
      ? props.subjects
          .filter(s => s.id !== props.subject.id)
          .reduce((sum, s) => sum + s.weight, 0)
      : props.subjects.reduce((sum, s) => sum + s.weight, 0)

    const newTotal = otherSubjectsTotal + form.value.weight
    if (newTotal > 100) {
      errors.value.weight = `Total weight would exceed 100% (current: ${otherSubjectsTotal}% + new: ${form.value.weight}% = ${newTotal}%)`
    }
  }

  return Object.keys(errors.value).length === 0
}

function addRule() {
  if (!form.value.rules) {
    form.value.rules = []
  }
  form.value.rules.push({
    name: '',
    desc: '',
    sign: '+',
    value: 0,
    status: 'active',
  })
}

function removeRule(index: number) {
  if (form.value.rules) {
    form.value.rules.splice(index, 1)
  }
}

function updateRule(index: number, field: string, value: any) {
  if (form.value.rules) {
    ;(form.value.rules[index] as any)[field] = value
  }
}

function saveSubject() {
  if (!validate()) return
  emit('save', {
    name: form.value.name.trim(),
    maxScore: form.value.maxScore,
    weight: form.value.weight,
    rules: form.value.rules,
  })
}

function closeModal() {
  form.value = {
    name: '',
    maxScore: 100,
    weight: 0,
    rules: [],
  }
  errors.value = {}
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="visible"
    :title="isEditing ? 'Edit Subject' : 'Add New Subject'"
    width="760px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <div class="space-y-5">
      <!-- Server Error -->
      <div
        v-if="serverError"
        class="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
          class="shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ serverError }}</span>
      </div>

      <!-- Subject Information -->
      <SubjectFormFields
        :form="form"
        :errors="errors"
        :name-status="nameStatus"
        :name-status-message="nameStatusMessage"
        :saving="saving"
        @update:name="form.name = $event"
        @update:max-score="form.maxScore = $event"
        @update:weight="form.weight = $event"
      />

      <!-- Divider -->
      <div class="border-t border-slate-100"></div>

      <!-- Rules Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-800">Deduction Rules</h3>
            <p class="mt-0.5 text-xs text-slate-400">Add optional rules to adjust scores</p>
          </div>
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <BaseButton
              v-if="form.rules && form.rules.length > 0"
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
                Add Rule
              </span>
            </BaseButton>
          </Transition>
        </div>

        <RuleFormFields
          :rules="form.rules || []"
          :saving="saving"
          @update:rule="updateRule"
          @remove="removeRule"
          @add="addRule"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          variant="secondary"
          :disabled="saving"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          :disabled="nameStatus === 'duplicate' || nameStatus === 'invalid' || saving"
          :loading="saving"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="saveSubject"
        >
          {{ isEditing ? 'Save Changes' : 'Add Subject' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
