<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LocationFields from './LocationFields.vue'
import InterestedStudentsList from './InterestedStudentsList.vue'
import { fetchPartnerNames } from '../service/service'
import type { SessionFormData, SessionStatus } from '../types/session'

const props = defineProps<{
  modelValue: SessionFormData
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SessionFormData]
  cancel: []
  save: []
  addStudent: []
}>()

const partnerNames = ref<string[]>([])
const statuses: SessionStatus[] = ['Upcoming', 'Completed', 'Cancelled']

function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function updateHostedBy(value: string) {
  emit('update:modelValue', { ...props.modelValue, hostedBy: value, ngoContact: value })
}

onMounted(async () => {
  partnerNames.value = await fetchPartnerNames()
})
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
    <div class="flex items-center justify-between bg-blue-600 px-5 py-4">
      <h3 class="text-base font-semibold text-white">
        {{ modelValue.id ? 'Edit Information Session' : 'New Information Session' }}
      </h3>
      <BaseButton variant="ghost" class="!px-0 !py-0 text-blue-100 hover:text-white" @click="emit('cancel')">
        <template #icon>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </template>
      </BaseButton>
    </div>

    <div class="space-y-5 px-5 py-5">
      <div>
        <p class="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
          <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="1.5" />
            <path d="M4 17c0-3.5 3-6 6-6s6 2.5 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Partner / Officer
        </p>
        <div class="mt-2 flex gap-4">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              class="rounded border-slate-300"
              :checked="modelValue.partnerType === 'ngo'"
              @change="update('partnerType', 'ngo')"
            />
            NGO Partner
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              class="rounded border-slate-300"
              :checked="modelValue.partnerType === 'pnc'"
              @change="update('partnerType', 'pnc')"
            />
            PNC Officer
          </label>
        </div>
      </div>

      <div v-if="modelValue.partnerType === 'ngo'" class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs font-medium text-slate-500">NGO Name</span>
          <input
            list="ngo-name-options"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Enter NGO name"
            :value="modelValue.ngoName"
            @input="update('ngoName', ($event.target as HTMLInputElement).value)"
          />
          <datalist id="ngo-name-options">
            <option v-for="name in partnerNames" :key="name" :value="name" />
          </datalist>
        </label>
        <label class="block">
          <span class="text-xs font-medium text-slate-500">NGO Contact</span>
          <input
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Contact person"
            :value="modelValue.ngoContact"
            @input="update('ngoContact', ($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs font-medium text-slate-500">Date <span class="text-rose-400">*</span></span>
          <input
            type="date"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="mm/dd/yyyy"
            :value="modelValue.date"
            @input="update('date', ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label class="block">
          <span class="text-xs font-medium text-slate-500">Time</span>
          <input
            type="time"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            :value="modelValue.time"
            @input="update('time', ($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>

      <label class="block">
        <span class="text-xs font-medium text-slate-500">Status</span>
        <select
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.status"
          @change="update('status', ($event.target as HTMLSelectElement).value as SessionStatus)"
        >
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>

      <div class="border-t border-slate-100 pt-5">
        <LocationFields
          :model-value="modelValue.location"
          @update:model-value="(loc) => update('location', loc)"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs font-medium text-slate-500">School <span class="text-rose-400">*</span></span>
          <input
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Enter school name"
            :value="modelValue.school"
            @input="update('school', ($event.target as HTMLInputElement).value)"
          />
        </label>
        <label class="block">
          <span class="text-xs font-medium text-slate-500">Hosted By</span>
          <input
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Full name of host"
            :value="modelValue.hostedBy"
            @input="updateHostedBy(($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>

      <label class="block max-w-[calc(50%-0.5rem)]">
        <span class="text-xs font-medium text-slate-500">Total Attendees</span>
        <input
          type="number"
          min="0"
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          :value="modelValue.totalAttendees"
          @input="update('totalAttendees', Number(($event.target as HTMLInputElement).value))"
        />
      </label>

      <InterestedStudentsList :students="modelValue.interestedStudents" @add-student="emit('addStudent')" />
    </div>

    <div class="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
      <BaseButton variant="secondary" @click="emit('cancel')">
        Cancel
      </BaseButton>
      <BaseButton variant="primary" @click="emit('save')">
        Create Session
      </BaseButton>
    </div>
  </div>
</template>