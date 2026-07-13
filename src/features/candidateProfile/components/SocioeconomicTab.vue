<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Candidate } from '../types/index'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  candidate: Candidate
}>()

const editData = reactive({
  familySize: '',
  monthlyIncome: '',
  occupation: '',
  housingType: '',
  hasDisability: 'No',
  disabilityType: '',
})

watch(
  () => props.candidate,
  (c) => {
    if (c) {
      editData.familySize = c.familySize?.toString() || ''
      editData.monthlyIncome = c.monthlyIncome || ''
      editData.occupation = c.occupation || ''
      editData.housingType = c.housingType || ''
      editData.hasDisability = c.hasDisability ? 'Yes' : 'No'
      editData.disabilityType = c.disabilityType || ''
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-6">
    <!-- Family Size & Monthly Income -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.familySize"
        label="FAMILY SIZE"
        placeholder="Number of family members"
      />
      <BaseInput
        v-model="editData.monthlyIncome"
        label="MONTHLY INCOME"
        placeholder="Enter monthly income"
      />
    </div>

    <!-- Occupation & Housing Type -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.occupation"
        label="OCCUPATION"
        placeholder="Enter occupation"
      />
      <BaseInput
        v-model="editData.housingType"
        label="HOUSING TYPE"
        placeholder="Select housing type"
      />
    </div>

    <!-- Disability Status -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.hasDisability"
        label="DISABILITY"
        placeholder="Yes/No"
      />
      <BaseInput
        v-if="editData.hasDisability === 'Yes'"
        v-model="editData.disabilityType"
        label="DISABILITY TYPE"
        placeholder="Describe disability"
      />
    </div>
  </div>
</template>
