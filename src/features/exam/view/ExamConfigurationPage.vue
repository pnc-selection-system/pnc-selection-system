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

      <!-- Configuration Section -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <SubjectsTable />
        <ExamConfiguration />
      </div>
    </div>
  </div>
</template>
