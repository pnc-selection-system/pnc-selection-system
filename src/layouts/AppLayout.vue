<script setup lang="ts">
import AppHeader from '@/components/layouts/AppHeader.vue'
import AppSidebar from '@/components/layouts/AppSidebar.vue'
</script>

<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden font-sans antialiased text-slate-900">
    <!-- Sidebar -->
    <AppSidebar />
    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0 bg-slate-100 overflow-hidden">
      <!-- Top Header -->
      <AppHeader />
      <!-- Page Content -->
      <main
        class="flex-1 overflow-y-auto overflow-x-hidden relative focus:outline-none hide-scrollbar"
        style="pointer-events: auto;"
      >
        <div class="p-6 md:p-8" style="pointer-events: auto;">
          <router-view v-slot="{ Component }">
            <transition
              name="page"
              mode="out-in"
            >
              <keep-alive :include="['ExamConfigurationPage']">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page transition (fade + subtle slide) ────────────────────── */
.page-enter-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.page-leave-active {
  transition: opacity 0.18s ease-in, transform 0.18s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
