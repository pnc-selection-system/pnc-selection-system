<script setup lang="ts">
import type { SessionFormData } from '../types/session'

defineProps<{
  modelValue: SessionFormData['partnerType']
  hasError: (field: string) => boolean
  fieldError: (field: string) => string | undefined
}>()

const emit = defineEmits<{
  change: [value: SessionFormData['partnerType']]
}>()
</script>

<template>
  <div class="space-y-3">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PARTNER TYPE</label>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="partnerType"
          value="School"
          :checked="modelValue === 'School'"
          @change="emit('change', 'School')"
          class="accent-blue-600"
        />
        <span class="text-sm text-slate-700">School</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="partnerType"
          value="Alumni"
          :checked="modelValue === 'Alumni'"
          @change="emit('change', 'Alumni')"
          class="accent-blue-600"
        />
        <span class="text-sm text-slate-700">Alumni</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="partnerType"
          value="NGO"
          :checked="modelValue === 'NGO'"
          @change="emit('change', 'NGO')"
          class="accent-blue-600"
        />
        <span class="text-sm text-slate-700">NGO</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="partnerType"
          value="Officer"
          :checked="modelValue === 'Officer'"
          @change="emit('change', 'Officer')"
          class="accent-blue-600"
        />
        <span class="text-sm text-slate-700">Officer</span>
      </label>
    </div>
    <p v-if="hasError('partnerType')" class="mt-1 text-xs text-red-500">{{ fieldError('partnerType') }}</p>
  </div>
</template>
