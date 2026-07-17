<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Candidate } from '../types/index'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', candidate: Omit<Candidate, 'id'>): void
}>()

const proxyVisible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})

const form = ref({
  fullName: '',
  gender: 'M' as 'M' | 'F',
  dateOfBirth: '',
  phone: '',
  province: '',
  address: '',
  organization: '',
  status: 'registered' as Candidate['status'],
  examResult: '' as string,
  examScore: '' as string | number,
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {        form.value = {
          fullName: '',
          gender: 'M',
          dateOfBirth: '',
          phone: '',
          province: '',
          address: '',
          organization: '',
          status: 'registered',
          examResult: '',
          examScore: '',
        }
    }
  },
)

function handleSave() {
  if (!form.value.fullName.trim()) return

  const dob = form.value.dateOfBirth ? new Date(form.value.dateOfBirth) : new Date()
  const age = new Date().getFullYear() - dob.getFullYear()

  const score = form.value.examScore === '' ? undefined : Number(form.value.examScore)
  emit('save', {
    ...form.value,
    age,
    roles: [],
    requirements: [],
    isDuplicate: false,
    examResult: (form.value.examResult || null) as Candidate['examResult'],
    examScore: score,
  })
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal v-model="proxyVisible" title="New Candidate" width="480px">
    <div class="space-y-2.5">
      <BaseInput
        v-model="form.fullName"
        label="Full Name *"
        placeholder="Enter full name"
      />

      <div class="grid grid-cols-2 gap-3">
        <div>
          <BaseSelect
            v-model="form.gender"
            label="Gender *"
            :options="[
              { value: 'M', label: 'Male' },
              { value: 'F', label: 'Female' },
            ]"
          />
        </div>
        <BaseInput
          v-model="form.dateOfBirth"
          label="Date of Birth"
          type="date"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <BaseInput
          v-model="form.phone"
          label="Phone"
          placeholder="+855 ..."
        />
        <BaseInput
          v-model="form.province"
          label="Province"
          placeholder="Select province"
        />
      </div>

      <BaseInput
        v-model="form.organization"
        label="NGO / Organization"
        placeholder="Enter organization name"
      />

      <BaseSelect
        v-model="form.status"
        label="Status"
        :options="[
          { value: 'registered', label: 'Registered' },
          { value: 'exam_done', label: 'Exam done' },
          { value: 'investigating', label: 'Investigating' },
          { value: 'assessed', label: 'Assessed' },
          { value: 'approved', label: 'Approved' },
        ]"
      />

      <BaseInput
        v-model="form.address"
        label="Address"
        placeholder="Village, commune, district..."
      />

      <!-- Exam Section -->
      <div class="border-t border-slate-200 pt-2.5">
        <p class="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Exam</p>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <BaseSelect
              v-model="form.examResult"
              label="Exam Result"
              :options="[
                { value: '', label: 'Not taken' },
                { value: 'pass', label: 'Pass' },
                { value: 'fail', label: 'Fail' },
              ]"
            />
          </div>
          <BaseInput
            v-model="form.examScore"
            label="Exam Score"
            type="number"
            placeholder="0-100"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <BaseButton
          variant="secondary"
          class="!w-auto"
          @click="emit('update:modelValue', false)"
        >
          Cancel
        </BaseButton>
        <BaseButton
          class="!w-auto"
          :disabled="!form.fullName.trim()"
          @click="handleSave"
        >
          Create Candidate
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
