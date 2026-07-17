<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseInput from '../../../components/base/BaseInput.vue'
import BaseButton from '../../../components/base/BaseButton.vue'
import type { ContactPerson } from '../types/partner'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [contact: Omit<ContactPerson, 'id'>]
}>()

const form = reactive({ name: '', role: '', phone: '', email: '' })
const error = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = ''
      form.role = ''
      form.phone = ''
      form.email = ''
      error.value = ''
    }
  },
)

function handleSubmit() {
  if (!form.name.trim() || !form.role.trim()) {
    error.value = 'Name and role are required'
    return
  }
  emit('submit', {
    name: form.name.trim(),
    role: form.role.trim(),
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
  })
}
</script>

<template>
  <BaseModal
    :model-value="open"
    title="Add contact"
    @update:model-value="emit('update:open', $event)"
  >
    <div class="space-y-4 py-2">
      <BaseInput
        v-model="form.name"
        label="Name"
        placeholder="e.g. Sopheak Lim"
        required
        :error="error"
      />
      <BaseInput v-model="form.role" label="Role" placeholder="e.g. Director" />
      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="form.phone" label="Phone" placeholder="+855 12 345 678" />
        <BaseInput v-model="form.email" label="Email" type="email" placeholder="name@example.org" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="secondary" class="!w-auto px-4" @click="emit('update:open', false)">
          Cancel
        </BaseButton>
        <BaseButton class="!w-auto px-4" @click="handleSubmit">
          Add Contact
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
