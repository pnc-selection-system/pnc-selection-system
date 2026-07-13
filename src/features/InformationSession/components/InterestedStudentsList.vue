<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { InterestedStudent } from '../types/session'

defineProps<{
  students: InterestedStudent[]
}>()

const emit = defineEmits<{
  addStudent: []
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <span class="flex items-center gap-1.5 text-sm text-slate-500">
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.5" />
        <path d="M4 17c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      Interested Students ({{ students.length }})
    </span>
    <BaseButton variant="ghost" @click="emit('addStudent')">
      <template #icon>
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>
      </template>
      Add student
    </BaseButton>
  </div>

  <ul v-if="students.length" class="mt-2 space-y-1">
    <li v-for="student in students" :key="student.id" class="text-sm text-slate-600">
      {{ student.name }}
    </li>
  </ul>
</template>