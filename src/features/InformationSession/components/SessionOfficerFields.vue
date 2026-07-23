<script setup lang="ts">
defineProps<{
  partnerName: string
  department: string
  hosts: { name: string }[]
  inputClasses: (field: string) => string
  fieldError: (field: string) => string | undefined
  hasError: (field: string) => boolean
  markTouched: (field: string) => void
}>()

const emit = defineEmits<{
  'update:partnerName': [value: string]
  'update:department': [value: string]
  addOfficerName: []
  removeHost: [index: number]
}>()
</script>

<template>
  <!-- Added officer names as rows -->
  <div v-if="hosts.length > 0" class="space-y-2">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">OFFICER NAMES</label>
    <div
      v-for="(host, index) in hosts"
      :key="index"
      class="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2"
    >
      <span class="flex-1 text-sm text-slate-700">{{ host.name }}</span>
      <button
        type="button"
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        title="Remove"
        @click="emit('removeHost', index)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Add new officer name row -->
  <div class="space-y-1.5">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ADD OFFICER NAME</label>
    <input
      type="text"
      :value="partnerName"
      :class="inputClasses('partnerName')"
      @input="emit('update:partnerName', ($event.target as HTMLInputElement).value)"
      @blur="markTouched('partnerName')"
      placeholder="Enter officer name"
    />
    <button
      type="button"
      class="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
      title="Add officer name"
      @click="emit('addOfficerName')"
    >
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add name
    </button>
    <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
  </div>

  <!-- Department field for Officer -->
  <div class="space-y-1.5">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DEPARTMENT *</label>
    <input
      type="text"
      :value="department"
      :class="inputClasses('department')"
      @input="emit('update:department', ($event.target as HTMLInputElement).value)"
      @blur="markTouched('department')"
      placeholder="Enter department name"
    />
    <p v-if="hasError('department')" class="mt-1 text-xs text-red-500">{{ fieldError('department') }}</p>
  </div>
</template>
