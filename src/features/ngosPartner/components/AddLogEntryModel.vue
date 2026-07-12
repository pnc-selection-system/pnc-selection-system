<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseButton from '../../../components/base/BaseButton.vue'
import BaseSelect from '../../../components/base/BaseSelect.vue'
import type { CommunicationChannel, CommunicationLogEntry } from '../types/communication'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [entry: Omit<CommunicationLogEntry, 'id'>]
}>()

const channels: CommunicationChannel[] = ['Email', 'Call', 'Visit', 'SMS']

const form = reactive({
  date: new Date().toISOString().slice(0, 10),
  channel: 'Email' as CommunicationChannel,
  summary: '',
})
const error = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.date = new Date().toISOString().slice(0, 10)
      form.channel = 'Email'
      form.summary = ''
      error.value = ''
    }
  },
)

function handleSubmit() {
  if (!form.summary.trim()) {
    error.value = 'Summary is required'
    return
  }
  emit('submit', { date: form.date, channel: form.channel, summary: form.summary.trim() })
  emit('update:open', false)
}
</script>

<template>
  <BaseModal
    :model-value="open"
    title="Log entry"
    @update:model-value="emit('update:open', $event)"
  >
    <div class="space-y-4 py-2">
      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="form.date" label="Date" type="date" />
        <BaseSelect
          v-model="form.channel"
          label="Channel"
          :options="channels"
          placeholder="Select channel"
        />
      </div>

      <BaseInput
        v-model="form.summary"
        label="Summary"
        placeholder="e.g. Shared shortlist of 12 candidates"
        required
        :error="error"
        @keyup.enter="handleSubmit"
      />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="secondary" class="!w-auto px-4" @click="emit('update:open', false)">
          Cancel
        </BaseButton>
        <BaseButton class="!w-auto px-4" @click="handleSubmit">
          Save Entry
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
