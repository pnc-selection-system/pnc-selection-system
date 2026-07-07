<script setup lang="ts">
import AppHeader from "@/components/layouts/AppHeader.vue"
import AppSidebar from "@/components/layouts/AppSidebar.vue"
</script>
<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
    <!-- Sidebar -->
    <AppSidebar />
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
      <!-- Top Header -->
      <AppHeader />
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto overflow-x-hidden relative focus:outline-none hide-scrollbar">
        <div class="p-6 md:p-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
<style scoped>
</style>
