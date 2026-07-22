<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Candidate } from '../types/index'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  candidate: Candidate
}>()

const editData = reactive({
  fullName: '',
  dateOfBirth: '',
  phone: '',
  province: '',
  address: '',
  organization: '',
})

watch(
  () => props.candidate,
  (c) => {
    if (c) {
      editData.fullName = c.fullName
      editData.dateOfBirth = c.dateOfBirth
      editData.phone = c.phone
      editData.province = c.province
      editData.address = c.address
      editData.organization = c.organization
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="space-y-6">
    <!-- Full Name & Date of Birth -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.fullName"
        label="FULL NAME"
        placeholder="Enter full name"
      />
      <BaseInput
        v-model="editData.dateOfBirth"
        label="DATE OF BIRTH"
        placeholder="DD / MM / YYYY"
      />
    </div>

    <!-- Phone & Province -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.phone"
        label="PHONE"
        placeholder="+855 ..."
      />
      <BaseInput
        v-model="editData.province"
        label="PROVINCE"
        placeholder="Select province"
      />
    </div>

    <!-- NGO & Address -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <BaseInput
        v-model="editData.organization"
        label="NGO"
        placeholder="NGO name"
      />
      <BaseInput
        v-model="editData.address"
        label="ADDRESS"
        placeholder="Village, commune, district..."
      />
    </div>
  </div>
</template>
