<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="w-40">
      <BaseSelect
        :model-value="localProvince"
        :options="[
          { value: '', label: 'Province: All' },
          { value: 'Phnom Penh', label: 'Phnom Penh' },
          { value: 'Siem Reap', label: 'Siem Reap' },
          { value: 'Battambang', label: 'Battambang' },
          { value: 'Kampong Cham', label: 'Kampong Cham' },
        ]"
        @update:model-value="localProvince = $event as string; emitFilter()"
      />
    </div>
    <div class="w-40">
      <BaseSelect
        :model-value="localNgo"
        :options="[
          { value: '', label: 'NGO: All' },
          { value: 'NGO A', label: 'NGO A' },
          { value: 'NGO B', label: 'NGO B' },
          { value: 'NGO C', label: 'NGO C' },
        ]"
        @update:model-value="localNgo = $event as string; emitFilter()"
      />
    </div>
    <div class="w-40">
      <BaseSelect
        :model-value="localStatus"
        :options="[
          { value: '', label: 'Status: All' },
          { value: 'Investigating', label: 'Investigating' },
          { value: 'Assessed', label: 'Assessed' },
          { value: 'Exam Done', label: 'Exam Done' },
        ]"
        @update:model-value="localStatus = $event as string; emitFilter()"
      />
    </div>
    <div class="w-40">
      <BaseSelect
        :model-value="localExamResult"
        :options="[
          { value: '', label: 'Result: All' },
          { value: 'Pass', label: 'Pass' },
          { value: 'Fail', label: 'Fail' },
        ]"
        @update:model-value="localExamResult = $event as string; emitFilter()"
      />
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
