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
      }
    }
  },
)

function handleSave() {
  if (!form.value.fullName.trim()) return

  const dob = form.value.dateOfBirth ? new Date(form.value.dateOfBirth) : new Date()
  const age = new Date().getFullYear() - dob.getFullYear()

  emit('save', {
    ...form.value,
    age,
    roles: [],
    requirements: [],
    isDuplicate: false,
    examResult: null,
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
      <div class="relative w-full max-w-[560px] rounded-xl bg-white shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-slate-900">New Candidate</h2>
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
        <div class="space-y-4 px-6 py-5">
          <BaseInput
            v-model="form.fullName"
            label="Full Name *"
            placeholder="Enter full name"
          />

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-slate-600">Gender *</label>
              <select
                v-model="form.gender"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <BaseInput
              v-model="form.dateOfBirth"
              label="Date of Birth"
              type="date"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
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

          <div class="flex flex-col gap-2">
            <label class="text-sm text-slate-600">Status</label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="registered">Registered</option>
              <option value="exam_done">Exam done</option>
              <option value="investigating">Investigating</option>
              <option value="assessed">Assessed</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <BaseInput
            v-model="form.address"
            label="Address"
            placeholder="Village, commune, district..."
          />
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
