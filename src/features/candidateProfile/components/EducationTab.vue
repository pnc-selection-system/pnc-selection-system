<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Candidate } from '../types/index'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  candidate: Candidate
}>()

const editData = reactive({
  educationLevel: '',
  schoolName: '',
  major: '',
  graduationYear: '',
  gpa: '',
})

watch(
  () => props.candidate,
  (c) => {
    if (c) {
      editData.educationLevel = c.educationLevel || ''
      editData.schoolName = c.schoolName || ''
      editData.major = c.major || ''
      editData.graduationYear = c.graduationYear || ''
      editData.gpa = c.gpa || ''
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-6">
    <!-- Education Level & School Name -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.educationLevel"
        label="EDUCATION LEVEL"
        placeholder="Select education level"
      />
      <BaseInput
        v-model="editData.schoolName"
        label="SCHOOL NAME"
        placeholder="Enter school name"
      />
    </div>

    <!-- Major & Graduation Year -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.major"
        label="MAJOR"
        placeholder="Enter major"
      />
      <BaseInput
        v-model="editData.graduationYear"
        label="GRADUATION YEAR"
        placeholder="YYYY"
      />
    </div>

    <!-- GPA -->
    <BaseInput
      v-model="editData.gpa"
      label="GPA"
      placeholder="0.00"
    />
  </div>
</template>
