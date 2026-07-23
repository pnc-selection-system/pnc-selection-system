<script setup lang="ts">
defineProps<{
  attendanceCount: number
  expectedAttendance: number
  inputClasses: (field: string) => string
  fieldError: (field: string) => string | undefined
  hasError: (field: string) => boolean
  markTouched: (field: string) => void
}>()

const emit = defineEmits<{
  'update:attendanceCount': [value: number]
  'update:expectedAttendance': [value: number]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ATTENDANCE COUNT</label>
      <input
        type="number"
        :value="attendanceCount"
        :class="inputClasses('attendanceCount')"
        @input="emit('update:attendanceCount', Number(($event.target as HTMLInputElement).value))"
        @blur="markTouched('attendanceCount')"
        placeholder="0"
        min="0"
      />
      <p v-if="hasError('attendanceCount')" class="mt-1 text-xs text-red-500">{{ fieldError('attendanceCount') }}</p>
    </div>
    <div class="space-y-1.5">
      <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">EXPECTED ATTENDANCE *</label>
      <input
        type="number"
        :value="expectedAttendance"
        :class="inputClasses('expectedAttendance')"
        @input="emit('update:expectedAttendance', Number(($event.target as HTMLInputElement).value))"
        @blur="markTouched('expectedAttendance')"
        placeholder="0"
        min="0"
      />
      <p v-if="hasError('expectedAttendance')" class="mt-1 text-xs text-red-500">{{ fieldError('expectedAttendance') }}</p>
    </div>
  </div>
</template>
