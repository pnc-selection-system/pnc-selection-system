<script setup lang="ts">
withDefaults(
  defineProps<{
    alt?: string
  }>(),
  {
    alt: 'PNC Logo',
  },
)
</script>

<template>
  <img src="@/assets/images/pncLogo.png" :alt="alt" />
</template>
