<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Exam } from '../types'
import { emptyForm } from '../types'
import { useExams } from '../composables/useExams'
import BaseModal from '@/components/base/BaseModal.vue'

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
      <div class="space-y-4">
        <div>
          <label for="name" class="mb-1.5 block text-sm font-medium text-slate-700">
            Exam Name <span class="text-rose-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm outline-none transition placeholder:text-slate-400',
              errors.name
                ? 'border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
            ]"
            placeholder="Enter exam name"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-rose-500">{{ errors.name }}</p>
        </div>

        <div>
          <label for="campaignId" class="mb-1.5 block text-sm font-medium text-slate-700">
            Campaign <span class="text-rose-500">*</span>
          </label>
          <select
            id="campaignId"
            v-model="form.campaignId"
            :class="[
              'w-full rounded-md border px-3 py-2 text-sm outline-none transition',
              errors.campaignId
                ? 'border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-100'
                : 'border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100',
            ]"
          >
            <option value="">Select a campaign</option>
            <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
              {{ campaign.name }}
            </option>
          </select>
          <p v-if="errors.campaignId" class="mt-1 text-xs text-rose-500">{{ errors.campaignId }}</p>
        </div>

        <div>
          <label for="description" class="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="min-h-[80px] w-full resize-y rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            placeholder="Enter exam description"
          ></textarea>
        </div>

        <div>
          <label for="status" class="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            v-model="form.status"
            class="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          @click="closeModal"
          class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          @click="saveExam"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {{ isEditing ? 'Save Changes' : 'Create Exam' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
