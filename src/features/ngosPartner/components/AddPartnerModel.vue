<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseButton from '../../../components/base/BaseButton.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [organisation: string]
  error: [message: string]
}>()

const organisation = ref('')
const error = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      organisation.value = ''
      error.value = ''
    }
  },
)

async function handleSubmit() {
  if (!organisation.value.trim()) {
    error.value = 'Organisation name is required'
    return
  }
  
  emit('submit', organisation.value.trim())
}
</script>

<template>
  <BaseModal
    :model-value="open"
    title=""
    @update:model-value="emit('update:open', $event)"
  >
    <div class="px-6 space-y-5">
      <!-- Header with icon -->
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100">
          <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
        </div>
        <div>
          <h3 class="text-[17px] text-slate-800">Add partner</h3>
          <p class="mt-0.5 text-[13px] text-slate-400">Register a new NGO or partner organisation</p>
        </div>
      </div>

      <!-- Form card -->
      <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
        <BaseInput
          v-model="organisation"
          label="Organisation name"
          placeholder="e.g. Future Light NGO"
          required
          :error="error"
          @keyup.enter="handleSubmit"
        />

        <div class="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3.5 py-2.5">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p class="text-[13px] leading-relaxed text-blue-700">
            Enter the name of the NGO or partner organisation to add to your list. You can add contact persons after creating the partner.
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton 
          variant="secondary" 
          class="!w-auto !px-5" 
          @click="emit('update:open', false)"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          class="!w-auto !px-5" 
          @click="handleSubmit"
        >
          Add Partner
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
