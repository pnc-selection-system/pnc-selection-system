<script setup lang="ts">
import { defineComponent, h } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// MenuItem is a small internal component for Sidebar items
const MenuItem = defineComponent({
  props: {
    title: { type: String, required: true },
    badge: String,
    to: String,
  },
  setup(props) {
    const handleClick = () => {
      if (props.to) {
        router.push(props.to)
      }
    }

    return () =>
      h(
        "a",
        {
          href: props.to || "#",
          class: "flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition mb-1",
          onClick: (e: Event) => {
            if (props.to) {
              e.preventDefault()
              handleClick()
            }
          },
        },
        [
          h("div", { class: "flex items-center gap-3" }, [
            h("div", { class: "w-2 h-2 rounded-sm bg-gray-500" }),
            h("span", { class: "text-xs text-gray-200" }, props.title),
          ]),
          props.badge
            ? h("span", { class: "text-[10px] text-gray-400" }, props.badge)
            : null,
        ]
      )
  },
})
</script>
<template>
  <aside class="w-[225px] bg-[#1F2937] text-gray-300 flex flex-col h-full border-r border-gray-700">
    <!-- Logo Section -->
    <div class="h-16 border-b border-gray-700 flex items-center px-3 shrink-0">
      <div class="w-10 h-10 rounded-lg border border-gray-600 flex items-center justify-center bg-white">
        <img src="@/assets/images/pncLogo.png" alt="PNC Logo" class="h-8 w-8 object-contain" />
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
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-2 font-medium">
          Home
        </p>
        <router-link
          to="/dashboard"
          class="flex items-center justify-between px-3 py-2 rounded-lg text-gray-200 transition mb-1"
          active-class="bg-slate-700 text-white border border-slate-600"
          exact-active-class="bg-slate-700 text-white border border-slate-600"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <span class="text-xs font-medium">Dashboard</span>
          </div>
          <span class="text-[8px] font-bold text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded">ALL</span>
        </router-link>
      </nav>
      <!-- SETUP -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-1 font-medium">
          Setup
        </p>
        <router-link
          to="/campaigns"
          class="flex items-center justify-between px-3 py-2 rounded-lg text-gray-200 transition mb-1"
          active-class="bg-slate-700 text-white border border-slate-600"
          exact-active-class="bg-slate-700 text-white border border-slate-600"
        >
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-sm bg-gray-500"></div>
            <span class="text-xs text-gray-200">Campaigns</span>
          </div>
          <span class="text-[10px] text-gray-400">MGR</span>
        </router-link>
        <MenuItem title="Users & Roles" badge="ADM" to="/users-roles" />
      </div>
      <!-- OUTREACH -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-1 font-medium">
          Outreach
        </p>
        <MenuItem title="Information Sessions" to="/information-sessions" />
        <router-link
          to="/ngos-partners"
          class="flex items-center justify-between px-3 py-2 rounded-lg text-gray-200 transition mb-1"
          active-class="bg-slate-700 text-white border border-slate-600"
          exact-active-class="bg-slate-700 text-white border border-slate-600"
        >
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-sm bg-gray-500"></div>
            <span class="text-xs text-gray-200">NGOs & Partners</span>
          </div>
        </router-link>
      </div>
      <!-- CANDIDATES -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-1 font-medium">
          Candidates
        </p>
        <MenuItem title="Candidate List" to="/candidates" />
        <MenuItem title="Candidate Profile" to="/candidates/profile" />
      </div>
      <!-- EXAM -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-1 font-medium">
          Exam
        </p>
        <MenuItem title="Exam Configuration" badge="MGR" to="/exam/configuration" />
        <router-link
          to="/exam/import-wizard"
          class="flex items-center justify-between px-3 py-2 rounded-lg text-gray-200 transition mb-1"
          active-class="bg-slate-700 text-white border border-slate-600"
          exact-active-class="bg-slate-700 text-white border border-slate-600"
        >
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            <span class="text-xs font-medium">Import Wizard</span>
          </div>
        </router-link>
        <MenuItem title="Results & Analytics" to="/exam/results" />
      </div>
      <!-- EVALUATION -->
      <div class="px-3 mt-2">
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-1 font-medium">
          Evaluation
        </p>
        <MenuItem title="Interest Assessment" to="/evaluation/interest" />
        <router-link
          to="/evaluation/home-investigation"
          class="flex items-center justify-between px-3 py-2 rounded-lg text-gray-200 transition mb-1"
          active-class="bg-slate-700 text-white border border-slate-600"
          exact-active-class="bg-slate-700 text-white border border-slate-600"
        >
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-sm bg-gray-500"></div>
            <span class="text-xs text-gray-200">Home Investigation</span>
          </div>
          <span class="text-[10px] text-gray-400">INV</span>
        </router-link>
      </div>
      <!-- DECISION -->
      <div class="px-3 mt-3 pb-4">
        <p class="text-[8px] tracking-[3px] text-gray-500 uppercase mb-1.5 font-medium">
          Decision
        </p>
        <MenuItem title="Voting & Selection" badge="CMT" to="/decision/voting-selection" />
        <MenuItem title="Reports & Exports" to="/decision/reports" />
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
</style>
