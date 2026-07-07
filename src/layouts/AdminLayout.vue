<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-64 bg-[#1F2937] text-gray-300 flex flex-col">

      <!-- Logo -->
      <div class="h-16 border-b border-gray-700 flex items-center px-5">
        <div
          class="w-10 h-10 rounded-lg border border-gray-600 flex items-center justify-center text-xs font-bold">
          PNC
        </div>

        <div class="ml-3">
          <h1 class="text-white font-semibold leading-none">
            Student Selection
          </h1>
          <p class="text-[10px] uppercase tracking-widest text-gray-400">
            Management System
          </p>
        </div>
      </div>

      <!-- Menu -->
      <div class="flex-1 overflow-y-auto">

        <!-- HOME -->
        <div class="px-5 mt-6">
          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Home
          </p>

          <a
            href="#"
            class="flex items-center justify-between rounded-lg bg-blue-600/20 text-white px-3 py-2 mt-1">

            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-sm bg-blue-500"></div>
              <span>Dashboard</span>
            </div>

            <span class="text-xs text-blue-300">
              ALL
            </span>

          </a>
        </div>

        <!-- SETUP -->
        <div class="px-5 mt-8">

          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Setup
          </p>

          <MenuItem title="Campaigns" badge="MGR"/>
          <MenuItem title="Users & Roles" badge="ADM"/>

        </div>

        <!-- OUTREACH -->
        <div class="px-5 mt-8">

          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Outreach
          </p>

          <MenuItem title="Information Sessions"/>
          <MenuItem title="NGOs & Partners"/>

        </div>

        <!-- CANDIDATES -->
        <div class="px-5 mt-8">

          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Candidates
          </p>

          <MenuItem title="Candidate List"/>
          <MenuItem title="Candidate Profile"/>

        </div>

        <!-- EXAM -->
        <div class="px-5 mt-8">

          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Exam
          </p>

          <MenuItem title="Exam Configuration" badge="MGR"/>
          <MenuItem title="Import Wizard"/>
          <MenuItem title="Results & Analytics"/>

        </div>

        <!-- EVALUATION -->
        <div class="px-5 mt-8">

          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Evaluation
          </p>

          <MenuItem title="Interest Assessment"/>
          <MenuItem title="Home Investigation" badge="INV"/>

        </div>

        <!-- DECISION -->
        <div class="px-5 mt-8">

          <p class="text-[10px] tracking-[3px] text-gray-500 uppercase mb-3">
            Decision
          </p>

          <MenuItem title="Voting & Selection" badge="CMT"/>
          <MenuItem title="Reports & Exports"/>

        </div>

      </div>

      <!-- Footer -->
      <div class="border-t border-gray-700 p-5 text-[11px] text-gray-500 leading-5">

        <div>LO-FI WIREFRAMES • v0.9</div>
        <div>Sprint 0 • S0-13 / S0-14</div>

        <div class="mt-3">
          Role legend:
          ADM admin
          .MGR 
          <br>manager
          INV officer
          CMT committee
        </div>

      </div>

    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Topbar -->
      <header
        class="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

        <!-- Left -->
        <div class="flex items-center gap-5">

          <button
            class="border rounded-lg px-4 py-2 hover:bg-gray-50 text-gray-700">

            ☰ Screens

          </button>

          <div class="relative">

            <input
              placeholder="Search candidates, sessions, NGOs..."
              class="w-[430px] rounded-full border bg-gray-50 px-12 py-2 outline-none focus:ring-2 focus:ring-blue-500"/>

            <svg
              class="absolute left-4 top-3 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">

              <path
                d="M21 21l-5-5m2-5a7 7 0 11-14 0a7 7 0 0114 0z"/>

            </svg>

          </div>

        </div>

        <!-- Right -->
        <div class="flex items-center gap-4">

          <button
            class="border rounded-lg px-4 py-2 bg-gray-50">

            📅 Campaign:
            <span class="font-semibold ml-2">
              2026
            </span>

          </button>

          <button
            class="border rounded-lg px-5 py-2 hover:bg-gray-100">
            Lock
          </button>

          <div
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">

            SM

          </div>

        </div>

      </header>

      <!-- Page -->
      <main class="flex-1 overflow-auto p-8">

        <div
          class="rounded-xl border bg-white h-full flex items-center justify-center text-gray-400 text-xl">

          Dashboard Content

        </div>

      </main>

    </div>

  </div>
</template>

<script setup>
import { defineComponent, h } from "vue";

const MenuItem = defineComponent({
  props: {
    title: String,
    badge: String,
  },
  setup(props) {
    return () =>
      h(
        "a",
        {
          href: "#",
          class:
            "flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition mb-1",
        },
        [
          h("div", { class: "flex items-center gap-3" }, [
            h("div", {
              class: "w-2 h-2 rounded-sm bg-gray-500",
            }),
            h("span", props.title),
          ]),
          props.badge
            ? h(
                "span",
                {
                  class: "text-[10px] text-gray-400",
                },
                props.badge
              )
            : null,
        ]
      );
  },
});
</script>

<style scoped>
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 20px;
}

::-webkit-scrollbar-track {
    background: transparent;
}
</style>