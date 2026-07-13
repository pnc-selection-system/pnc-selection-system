<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Candidate } from '../types/index'
import BaseInput from '@/components/base/BaseInput.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', candidate: Omit<Candidate, 'id'>): void
}>()

const form = ref({
  fullName: '',
  gender: 'M' as 'M' | 'F',
  dateOfBirth: '',
  phone: '',
  province: '',
  address: '',
  organization: '',
  status: 'registered' as Candidate['status'],
  examResult: null as Candidate['examResult'],
  examScore: '' as string | number,
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      form.value = {
        fullName: '',
        gender: 'M',
        dateOfBirth: '',
        phone: '',
        province: '',
        address: '',
        organization: '',
        status: 'registered',
        examResult: null,
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
    examResult: form.value.examResult,
    examScore: score,
  })
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="emit('close')"
      />

      <!-- Modal -->
      <div class="relative w-full max-w-[440px] rounded-xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 class="text-base font-semibold text-slate-900">New Candidate</h2>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            @click="emit('close')"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="space-y-2.5 px-5 py-3">
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
                    { value: null, label: 'Not taken' },
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

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!form.fullName.trim()"
            @click="handleSave"
          >
            Create Candidate
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
