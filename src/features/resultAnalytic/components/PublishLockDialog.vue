<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  open: boolean
  roundLabel: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <BaseModal :open="open" title="Publish & lock results" @update:open="emit('update:open', $event)">
    <p class="text-sm text-slate-600">
      You're about to publish and lock <strong>{{ roundLabel }}</strong>. This action is
      <strong>irreversible</strong> — results become read-only and will feed downstream ranking,
      assessment, and voting. Make sure all scores have been verified before continuing.
    </p>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('update:open', false)">Cancel</BaseButton>
      <BaseButton class="!bg-blue-600 hover:!bg-blue-700" @click="emit('confirm')">
        Yes, publish & lock
      </BaseButton>
    </template>
  </BaseModal>
</template>