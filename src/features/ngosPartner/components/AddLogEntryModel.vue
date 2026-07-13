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
    title=""
    @update:model-value="emit('update:open', $event)"
  >
    <div class="px-1 pt-2 pb-1">
      <!-- Header with icon -->
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 ring-1 ring-violet-100">
          <svg class="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <div>
          <h3 class="text-[17px] text-slate-800">Log entry</h3>
          <p class="mt-0.5 text-[13px] text-slate-400">Record a communication with this partner</p>
        </div>
      </div>

      <!-- Form card -->
      <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-5">
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
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3 border-t border-slate-100 px-1 pt-4">
        <BaseButton variant="secondary" class="!w-auto !px-5" @click="emit('update:open', false)">
          Cancel
        </BaseButton>
        <BaseButton class="!w-auto !px-5" @click="handleSubmit">
          Save Entry
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
