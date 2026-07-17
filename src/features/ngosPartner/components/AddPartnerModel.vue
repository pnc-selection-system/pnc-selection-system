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

function handleSubmit() {
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
    title="Add partner"
    @update:model-value="emit('update:open', $event)"
  >
    <div class="py-2">
      <BaseInput
        v-model="organisation"
        label="Organisation"
        placeholder="e.g. Future Light NGO"
        required
        :error="error"
        @keyup.enter="handleSubmit"
      />
      <p class="mt-2 text-xs text-slate-500">
        Enter the name of the NGO or partner organisation to add to your list.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton 
          variant="secondary" 
          class="!w-auto px-4" 
          @click="emit('update:open', false)"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          class="!w-auto px-4" 
          @click="handleSubmit"
        >
          Add Partner
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
