<script setup lang="ts">
import AppLogo from "@/components/AppLogo.vue"
import SidebarMenuItem from "@/components/layouts/SidebarMenuItem.vue"
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
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-2 font-medium">
          Home
        </p>
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
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">
          Setup
        </p>
        <router-link
          to="/campaigns"
          class="flex items-center justify-between px-3 py-2 rounded text-gray-400 transition mb-1 hover:bg-slate-700/50"
          active-class="!text-white bg-slate-700 border border-slate-600 active-link"
        >
          <div class="flex items-center gap-3">
            <div class="dot w-2 h-2 rounded-sm bg-gray-500 transition"></div>
            <span class="text-xs">Campaigns</span>
          </div>
          <span class="badge text-[10px] text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded transition">MGR</span>
        </router-link>
        <SidebarMenuItem title="Users & Roles" badge="ADM" />
      </div>
      <!-- OUTREACH -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">
          Outreach
        </p>
        <router-link
          to="/outreach/information-sessions"
          class="flex items-center justify-between px-3 py-2 rounded text-gray-400 transition mb-1 hover:bg-slate-700/50"
          active-class="!text-white bg-slate-700 border border-slate-600 active-link"
        >
          <div class="flex items-center gap-3">
            <div class="dot w-2 h-2 rounded-sm bg-gray-500 transition"></div>
            <span class="text-xs">Information Sessions</span>
          </div>
          <span class="badge text-[10px] text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded transition">OFF</span>
        </router-link>
        <router-link
          to="/ngos-partners"
          class="flex items-center justify-between px-3 py-2 rounded text-gray-400 transition mb-1 hover:bg-slate-700/50"
          active-class="!text-white bg-slate-700 border border-slate-600 active-link"
        >
          <div class="flex items-center gap-3">
            <div class="dot w-2 h-2 rounded-sm bg-gray-500 transition"></div>
            <span class="text-xs">NGOs & Partners</span>
          </div>
        </router-link>
      </div>
      <!-- CANDIDATES -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">
          Candidates
        </p>
        <SidebarMenuItem title="Candidate List" to="/candidates" />
        <SidebarMenuItem title="Candidate Profile" to="/candidates/1" />
      </div>
      <!-- EXAM -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">
          Exam
        </p>
        <SidebarMenuItem title="Exam Configuration" to="/exams" badge="MGR" />
        <SidebarMenuItem title="Import Wizard" to="/exam/import-wizard" />
        <SidebarMenuItem title="Results & Analytics" />
      </div>
      <!-- EVALUATION -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1 font-medium">
          Evaluation
        </p>
        <SidebarMenuItem title="Interest Assessment" />
        <SidebarMenuItem title="Home Investigation" badge="INV" />
      </div>
      <!-- DECISION -->
      <div class="px-3 mt-3 pb-4">
        <p class="text-[8px] tracking-[2px] text-gray-500 uppercase mb-1.5 font-medium">
          Decision
        </p>
        <SidebarMenuItem title="Voting & Selection" badge="CMT" />
        <SidebarMenuItem title="Reports & Exports" />
      </div>
    </div>
    <!-- Footer -->
    <div class="border-t border-gray-700 p-5 text-[11px] text-gray-500 leading-relaxed shrink-0 bg-[#1F2937]">
      <div class="font-medium text-gray-400">LO-FI WIREFRAMES • v0.9</div>
      <div>Sprint 0 • S0-13 / S0-14</div>
      <div class="mt-3 text-[8px] text-gray-600 uppercase tracking-tighter">
        Role legend: ADM admin • MGR manager • INV officer • CMT committee
      </div>
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