<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <el-alert
    :title="message"
    type="error"
    show-icon
    :closable="false"
    class="rounded-xl"
  />
</template>
