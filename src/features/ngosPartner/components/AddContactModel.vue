<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseButton from '../../../components/base/BaseButton.vue'
import type { ContactPersonFormData } from '../types/partner'

const props = defineProps<{
  open: boolean
  saving?: boolean
  apiError?: string | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [contact: ContactPersonFormData]
}>()

const form = reactive({ full_name: '', role: '', phone: '', email: '' })
const validationError = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.full_name = ''
      form.role = ''
      form.phone = ''
      form.email = ''
      validationError.value = ''
    }
  },
)

function handleSubmit() {
  if (!form.full_name.trim()) {
    validationError.value = 'Full name is required'
    return
  }
  validationError.value = ''
  emit('submit', {
    full_name: form.full_name.trim(),
    role: form.role.trim() || undefined,
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
  })
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
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 ring-1 ring-emerald-100">
          <svg class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        </div>
        <div>
          <h3 class="text-[17px] text-slate-800">Add contact</h3>
          <p class="mt-0.5 text-[13px] text-slate-400">Link a contact person to this partner</p>
        </div>
      </div>

      <!-- Server error banner -->
      <div
        v-if="apiError"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
      >
        {{ apiError }}
      </div>

      <!-- Form card -->
      <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.full_name"
            label="Full name"
            placeholder="e.g. Sopheak Lim"
            required
            :error="validationError"
          />
          <BaseInput v-model="form.role" label="Role / title" placeholder="e.g. Director" />
        </div>

        <div class="border-t border-slate-200 pt-4">
          <p class="mb-3 text-[13px] text-slate-400">Contact details <span class="text-slate-300">(optional)</span></p>
          <div class="grid grid-cols-2 gap-4">
            <BaseInput v-model="form.phone" label="Phone" placeholder="+855 12 345 678" />
            <BaseInput v-model="form.email" label="Email" type="email" placeholder="name@example.org" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" class="!w-auto !px-5" @click="emit('update:open', false)">
          Cancel
        </BaseButton>
        <BaseButton class="!w-auto !px-5" :loading="saving" @click="handleSubmit">
          Add Contact
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
