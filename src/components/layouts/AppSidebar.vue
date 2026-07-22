<script setup lang="ts">
import AppLogo from "@/components/AppLogo.vue"
import SidebarMenuItem from "@/components/layouts/SidebarMenuItem.vue"
import { usePermission } from "@/composables/usePermission"
import { useAuthStore } from "@/features/auth/store/authStore"

const { can, isAdmin } = usePermission()
const authStore = useAuthStore()
console.log('[Sidebar] user:', JSON.stringify(authStore.user))
console.log('[Sidebar] isAdmin:', isAdmin.value)
console.log('[Sidebar] can campaigns:view:', can('campaigns:view'))
</script>

<template>
  <aside class="w-[225px] bg-[#1F2937] text-gray-300 flex flex-col h-full border-r border-gray-700">
    <!-- Logo Section -->
    <div class="h-16 border-b border-gray-700 flex items-center px-3 shrink-0">
      <div class="w-10 h-10 rounded-lg border border-gray-600 flex items-center justify-center bg-white">
        <AppLogo class="h-8 w-8 object-contain" />
      </div>
      <div class="ml-2">
        <h1 class="text-white font-semibold leading-none text-sm tracking-tight">
          Student Selection
        </h1>
        <p class="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
          Management System
        </p>
      </div>
    </div>

    <!-- Scrollable Menu -->
    <div class="flex-1 overflow-y-auto hide-scrollbar">

      <!-- HOME -->
      <nav class="px-4 mt-4">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-2 font-medium">Home</p>
        <router-link
          to="/dashboard"
          class="flex items-center justify-between px-3 py-2 rounded text-gray-400 transition mb-1 hover:bg-slate-700/50"
          exact-active-class="!text-white bg-slate-700 border border-slate-600 active-link"
        >
          <div class="flex items-center gap-2">
            <div class="dot w-2 h-2 rounded-sm bg-gray-500 transition"></div>
            <span class="text-xs font-medium">Dashboard</span>
          </div>
          <span class="badge text-[8px] font-bold text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded transition">ALL</span>
        </router-link>
      </nav>

      <!-- SETUP -->
      <div v-if="can('campaigns:view') || can('users:view')" class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">Setup</p>
        <SidebarMenuItem v-if="can('campaigns:view')" title="Campaigns" to="/campaigns" badge="MGR" />
        <SidebarMenuItem v-if="can('users:view')" title="Users & Roles" to="/users" badge="ADM" />
      </div>

      <!-- OUTREACH -->
      <div v-if="can('sessions:view') || can('ngos:view')" class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">Outreach</p>
        <SidebarMenuItem v-if="can('sessions:view')" title="Information Sessions" to="/outreach/information-sessions" badge="OFF" />
        <SidebarMenuItem v-if="can('ngos:view')" title="NGOs & Partners" to="/ngos-partners" />
      </div>

      <!-- CANDIDATES -->
      <div v-if="can('candidates:view')" class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">Candidates</p>
        <SidebarMenuItem title="Candidate List" to="/candidates" />
      </div>

      <!-- EXAM -->
      <div v-if="can('exam:view') || can('exam:import') || can('exam:results')" class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">Exam</p>
        <SidebarMenuItem v-if="can('exam:view')" title="Exam Configuration" to="/exams" badge="MGR" />
        <SidebarMenuItem v-if="can('exam:import')" title="Import Wizard" to="/exam/import-wizard" />
        <SidebarMenuItem v-if="can('exam:results')" title="Results & Analytics" to="/exam/results" />
      </div>

      <!-- EVALUATION -->
      <div v-if="can('assessment:view') || can('homeinv:view')" class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">Evaluation</p>
        <SidebarMenuItem v-if="can('assessment:view')" title="Interest Assessment" to="/evaluation/interest" />
        <SidebarMenuItem v-if="can('homeinv:view')" title="Home Investigation" to="/evaluation/home-investigation" badge="INV" />
      </div>

      <!-- DECISION -->
      <div v-if="can('voting:view') || can('reports:view')" class="px-3 mt-3 pb-4">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1.5 font-medium">Decision</p>
        <SidebarMenuItem v-if="can('voting:view')" title="Voting & Selection" to="/decision/voting-selection" badge="CMT" />
        <SidebarMenuItem v-if="can('reports:view')" title="Reports & Exports" to="/reports" badge="OFF" />
      </div>

    </div>

    <!-- Footer -->
    <div class="border-t border-gray-700 p-5 text-[11px] text-gray-500 leading-relaxed shrink-0 bg-[#1F2937]">
      <div class="font-medium text-gray-400">PNC Selection System</div>
      <div class="mt-1 text-[10px] text-gray-600 capitalize">{{ $route.meta.title ?? '' }}</div>
    </div>
  </aside>
</template>

<style scoped>
.active-link .dot {
  background-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}
.active-link .badge {
  color: #93c5fd;
  background-color: rgba(59, 130, 246, 0.1);
}
</style>
