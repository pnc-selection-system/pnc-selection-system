<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="w-40">
      <select
        v-model="localProvince"
        class="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        @change="emitFilter"
      >
        <option value="">Province: All</option>
        <option>Phnom Penh</option>
        <option>Siem Reap</option>
        <option>Battambang</option>
        <option>Kampong Cham</option>
      </select>
    </div>
    <div class="w-40">
      <select
        v-model="localNgo"
        class="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        @change="emitFilter"
      >
        <option value="">NGO: All</option>
        <option>NGO A</option>
        <option>NGO B</option>
        <option>NGO C</option>
      </select>
    </div>
    <div class="w-40">
      <select
        v-model="localStatus"
        class="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        @change="emitFilter"
      >
        <option value="">Status: All</option>
        <option>Investigating</option>
        <option>Assessed</option>
        <option>Exam Done</option>
      </select>
    </div>
    <div class="w-40">
      <select
        v-model="localExamResult"
        class="w-full px-3 py-2 text-xs border border-slate-200 rounded bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        @change="emitFilter"
      >
        <option value="">Result: All</option>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
      </select>
    </div>
    <button
      class="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition font-medium"
      @click="resetFilters"
    >
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

function emitFilter() {
  emit('filter', {
    province: localProvince.value,
    ngo: localNgo.value,
    status: localStatus.value,
    examResult: localExamResult.value,
  })
}

function resetFilters() {
  localProvince.value = ''
  localNgo.value = ''
  localStatus.value = ''
  localExamResult.value = ''
  emitFilter()
}
</script>
