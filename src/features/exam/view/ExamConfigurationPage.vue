<script setup lang="ts">
import SubjectsTable from '../components/SubjectsTable.vue'
import ExamConfiguration from '../components/ExamConfiguration.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader
        breadcrumb="Configuration"
        title="Exam Configuration"
      />

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px] items-start">
        <SubjectsTable />
        <ExamConfiguration />
      </div>
    </div>
  </div>
</template>
