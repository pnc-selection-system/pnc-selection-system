<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Exam } from '../types'
import { emptyForm } from '../types'
import { useExams } from '../service/useExams'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const props = defineProps<{
  visible: boolean
  exam: Exam | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addExam, updateExam, campaigns } = useExams()

const isEditing = ref(false)
const form = ref<Exam>({ ...emptyForm })
const errors = ref<Record<string, string>>({})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      errors.value = {}
      if (props.exam) {
        isEditing.value = true
        form.value = { ...props.exam }
      } else {
        isEditing.value = false
        form.value = { ...emptyForm, id: crypto.randomUUID() }
      }
    }
  },
)

function validate(): boolean {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Exam name is required'
  }

  if (!form.value.campaignId) {
    errors.value.campaignId = 'Campaign is required'
  }

  return Object.keys(errors.value).length === 0
}

function saveExam() {
  if (!validate()) return

  const selectedCampaign = campaigns.value.find((c) => c.id === form.value.campaignId)
  if (selectedCampaign) {
    form.value.campaignName = selectedCampaign.name
  }

  if (isEditing.value) {
    updateExam({ ...form.value })
  } else {
    addExam({ ...form.value })
  }
  closeModal()
}

function closeModal() {
  form.value = { ...emptyForm }
  errors.value = {}
  emit('close')
}

const campaignOptions = computed(() => {
  return [
    { value: '', label: 'Select a campaign' },
    ...campaigns.value.map((c) => ({ value: c.id, label: c.name })),
  ]
})

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
]
</script>

<template>
  <BaseModal
    :model-value="visible"
    :title="isEditing ? 'Edit Exam' : 'New Exam'"
    width="520px"
    destroy-on-close
    @update:model-value="closeModal"
  >
    <form @submit.prevent="saveExam">
      <div class="space-y-4 py-2">
        <BaseInput
          v-model="form.name"
          label="Exam Name"
          placeholder="Enter exam name"
          required
        />
        <p v-if="errors.name" class="-mt-2 text-xs text-rose-500">{{ errors.name }}</p>

        <BaseSelect
          v-model="form.campaignId"
          label="Campaign"
          :options="campaignOptions"
          placeholder="Select a campaign"
        />
        <p v-if="errors.campaignId" class="-mt-2 text-xs text-rose-500">{{ errors.campaignId }}</p>

        <BaseInput
          v-model="form.description"
          label="Description"
          type="textarea"
          :rows="3"
          placeholder="Enter exam description"
        />

        <BaseSelect
          v-model="form.status"
          label="Status"
          :options="statusOptions"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2"
          @click="closeModal"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          class="!w-auto !rounded !px-4 !py-2"
          @click="saveExam"
        >
          {{ isEditing ? 'Save Changes' : 'Create Exam' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
