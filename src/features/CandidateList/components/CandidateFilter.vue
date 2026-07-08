<template>
  <div class="bg-white rounded-lg shadow p-4 space-y-3">
    <h3 class="font-semibold text-gray-700 uppercase text-sm">Filters</h3>

    <select v-model="localProvince" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">All Provinces</option>
      <option>Phnom Penh</option>
      <option>Siem Reap</option>
      <option>Battambang</option>
      <option>Kampong Cham</option>
    </select>

    <select v-model="localNgo" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">All NGOs</option>
      <option>NGO A</option>
      <option>NGO B</option>
      <option>NGO C</option>
    </select>

    <select v-model="localStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">All Statuses</option>
      <option>Investigating</option>
      <option>Assessed</option>
      <option>Exam Done</option>
    </select>

    <select v-model="localExamResult" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">All Results</option>
      <option value="Pass">Pass</option>
      <option value="Fail">Fail</option>
    </select>

    <button @click="applyFilters" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
      Apply Filters
    </button>
    <button @click="resetFilters" class="w-full py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition">
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  filter: [{ province: string; ngo: string; status: string; examResult: string }]
}>()

const localProvince = ref('')
const localNgo = ref('')
const localStatus = ref('')
const localExamResult = ref('')

const applyFilters = () => {
  emit('filter', {
    province: localProvince.value,
    ngo: localNgo.value,
    status: localStatus.value,
    examResult: localExamResult.value,
  })
}

const resetFilters = () => {
  localProvince.value = ''
  localNgo.value = ''
  localStatus.value = ''
  localExamResult.value = ''
  applyFilters()
}
</script>
