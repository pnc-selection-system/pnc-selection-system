<template>
  <BaseInput
    :model-value="modelValue"
    placeholder="Search name, ID, school..."
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
