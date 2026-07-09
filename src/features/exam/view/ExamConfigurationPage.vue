<script setup lang="ts">
import SubjectsTable from '../components/SubjectsTable.vue'
import ExamConfiguration from '../components/ExamConfiguration.vue'
</script>

<template>
  <div class="min-h-screen px-4 pt-2 pb-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1200px]">
      <!-- Breadcrumb -->
      <div class="mb-2 text-xs uppercase tracking-widest text-slate-400">
        Configuration
      </div>

      <!-- Title -->
      <h1 class="mb-4 text-2xl font-semibold text-slate-900">Exam configuration</h1>

      <!-- Roles & Requirements -->
      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-md bg-slate-50 px-4 py-3">
        <div class="flex items-center gap-2 text-xs">
          <span class="font-semibold uppercase tracking-wider text-slate-400">Roles</span>
          <span class="text-slate-600">Selection Manager</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="font-semibold uppercase tracking-wider text-slate-400">Reqs</span>
          <span class="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600">FR-EX-2</span>
          <span class="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600">FR-EX-3</span>
          <span class="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600">FR-EX-4</span>
        </div>
      </div>

      <!-- Configuration Section -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <SubjectsTable />
        <ExamConfiguration />
      </div>
    </div>
  </div>
</template>
