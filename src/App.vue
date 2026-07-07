<script setup lang="ts">
import AdminLayout from './layouts/AdminLayout.vue'
</script>

<template>
  <AdminLayout>
    <router-view />
  </AdminLayout>
</template>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

a {
  color: #3b82f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
