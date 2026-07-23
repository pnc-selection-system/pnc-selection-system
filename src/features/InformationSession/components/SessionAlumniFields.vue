<script setup lang="ts">
defineProps<{
  partnerName: string
  school: string
  generation: string
  location: string
  inputClasses: (field: string) => string
  fieldError: (field: string) => string | undefined
  hasError: (field: string) => boolean
  markTouched: (field: string) => void
}>()

const emit = defineEmits<{
  'update:partnerName': [value: string]
  'update:school': [value: string]
  'update:generation': [value: string]
  'update:location': [value: string]
}>()
</script>

<template>
  <div class="space-y-1.5">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ALUMNI NAME *</label>
    <input
      type="text"
      :value="partnerName"
      :class="inputClasses('partnerName')"
      @input="emit('update:partnerName', ($event.target as HTMLInputElement).value)"
      @blur="markTouched('partnerName')"
      placeholder="Enter alumni name"
    />
    <p v-if="hasError('partnerName')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerName') }}</p>
  </div>
  <div class="space-y-1.5">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SCHOOL *</label>
    <input
      type="text"
      :value="school"
      :class="inputClasses('school')"
      @input="emit('update:school', ($event.target as HTMLInputElement).value)"
      @blur="markTouched('school')"
      placeholder="Enter school name"
    />
    <p v-if="hasError('school')" class="mt-1 text-xs text-red-500">{{ fieldError('school') }}</p>
  </div>
  <div class="space-y-1.5">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">GENERATION *</label>
    <input
      type="text"
      :value="generation"
      :class="inputClasses('generation')"
      @input="emit('update:generation', ($event.target as HTMLInputElement).value)"
      @blur="markTouched('generation')"
      placeholder="Enter generation"
    />
    <p v-if="hasError('generation')" class="mt-1 text-xs text-red-500">{{ fieldError('generation') }}</p>
  </div>
  <div class="space-y-1.5">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">LOCATION *</label>
    <input
      type="text"
      :value="location"
      :class="inputClasses('location')"
      @input="emit('update:location', ($event.target as HTMLInputElement).value)"
      @blur="markTouched('location')"
      placeholder="Enter location"
    />
    <p v-if="hasError('location')" class="mt-1 text-xs text-red-500">{{ fieldError('location') }}</p>
  </div>
</template>
