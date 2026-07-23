<script setup lang="ts">
import BaseModal from '../../../components/base/BaseModal.vue'
import BaseButton from '../../../components/base/BaseButton.vue'

defineProps<{
  open: boolean
  roundLabel: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function close() {
  emit('update:open', false)
}

function confirmLock() {
  emit('confirm')
}
</script>

<template>
  <BaseModal :model-value="open" title="Lock round" @update:model-value="close">
    <p class="text-sm text-slate-600">
      You're about to lock <strong>{{ roundLabel }}</strong>. This action is
      <strong>irreversible</strong> — voting closes, the tally becomes final, and the round becomes
      read-only. Make sure all committee members have voted before continuing.
    </p>

    <template #footer>
      <BaseButton variant="outline" @click="close">Cancel</BaseButton>
      <BaseButton variant="primary" @click="confirmLock">
        Yes, lock round
      </BaseButton>
    </template>
  </BaseModal>
</template>