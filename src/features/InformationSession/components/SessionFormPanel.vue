<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { SessionFormData } from '../types/session'
import type { SessionFilterOptions } from '../types/filter'

const props = defineProps<{
  modelValue: SessionFormData
  options: SessionFilterOptions
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFormData]
  save: []
  cancel: []
}>()

const isEdit = computed(() => Boolean(props.modelValue.id))
const isSaving = ref(false)

const schoolChoices = computed(() => props.options.schools.filter((s) => s !== 'All'))

function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const isValid = computed(() => {
  return props.modelValue.date && props.modelValue.province && props.modelValue.school
})

async function onSave() {
  if (!isValid.value || isSaving.value) return
  isSaving.value = true
  try {
    await emit('save')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <!-- Form Header -->
    <div class="mb-2">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {{ isEdit ? 'EDIT SESSION' : 'NEW SESSION' }}
      </p>
    </div>

    <!-- Form Body -->
    <div class="space-y-2">
      <!-- Date and Province -->
      <div class="grid grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">DATE</label>
          <BaseInput
            type="date"
            :model-value="modelValue.date"
            @update:model-value="(v: string) => update('date', v)"
            placeholder="dd / mm / yyyy"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PROVINCE</label>
          <BaseSelect
            :model-value="modelValue.province"
            @update:model-value="(v: string | number) => update('province', v as string)"
            :options="options.provinces.filter(x => x !== 'All')"
            placeholder="Province"
          />
        </div>
      </div>

      <!-- School -->
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">SCHOOL</label>
        <BaseSelect
          :model-value="modelValue.school"
          @update:model-value="(v: string | number) => update('school', v as string)"
          :options="schoolChoices"
          placeholder="School"
        />
      </div>

      <!-- Attendance and Campaign -->
      <div class="grid grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">ATTENDANCE COUNT</label>
          <BaseInput
            type="number"
            :model-value="String(modelValue.attendanceCount)"
            @update:model-value="(v: string) => update('attendanceCount', Number(v))"
            placeholder="0"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">📅 CAMPAIGN</label>
          <BaseInput
            :model-value="modelValue.campaign"
            disabled
          />
        </div>
      </div>

      <!-- Participant List -->
      <div class="space-y-1.5">
        <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">PARTICIPANT LIST</label>
        <textarea
          rows="5"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 resize-none"
          placeholder="Add rows or paste · each row can be converted to a candidate (FR-IS-5)"
          :value="modelValue.participantList"
          @input="update('participantList', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-1">
        <BaseButton variant="secondary" @click="emit('cancel')">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" :disabled="!isValid || isSaving" :loading="isSaving" @click="onSave">
          Save session
        </BaseButton>
      </div>
    </div>
  </div>
</template>
