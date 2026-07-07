<script setup lang="ts">
import { computed, ref } from 'vue'
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

const layout = ref<'drawer' | 'page'>('drawer')
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
    <div class="flex items-center justify-between mb-8">
      <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
        NEW / EDIT SESSION
      </p>
      <div class="flex items-center rounded-lg bg-slate-100 p-0.5">
        <button
          type="button"
          class="rounded-md px-3 py-1 text-[11px] font-mono transition-colors"
          :class="layout === 'drawer' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'"
          @click="layout = 'drawer'"
        >
          drawer
        </button>
        <span class="mx-0.5 text-slate-300">/</span>
        <button
          type="button"
          class="rounded-md px-3 py-1 text-[11px] font-mono transition-colors"
          :class="layout === 'page' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'"
          @click="layout = 'page'"
        >
          page
        </button>
      </div>
    </div>

    <!-- Form Body -->
    <div class="space-y-6">
      <!-- Date and Province -->
      <div class="grid grid-cols-2 gap-5">
        <div class="space-y-2">
          <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">DATE</label>
          <input
            type="date"
            class="w-full rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 placeholder-slate-300 transition-shadow"
            placeholder="dd / mm / yyyy"
            :value="modelValue.date"
            @input="update('date', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="space-y-2">
          <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">PROVINCE</label>
          <div class="relative">
            <select
              class="w-full rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 appearance-none bg-transparent transition-shadow"
              :value="modelValue.province"
              @change="update('province', ($event.target as HTMLSelectElement).value)"
            >
              <option value="" disabled>Select</option>
              <option v-for="p in options.provinces.filter(x => x !== 'All')" :key="p" :value="p">{{ p }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- School -->
      <div class="space-y-2">
        <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">SCHOOL</label>
        <div class="relative">
          <select
            class="w-full rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 appearance-none bg-transparent transition-shadow"
            :value="modelValue.school"
            @change="update('school', ($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>Searchable select</option>
            <option v-for="s in schoolChoices" :key="s" :value="s">{{ s }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Attendance and Campaign -->
      <div class="grid grid-cols-2 gap-5">
        <div class="space-y-2">
          <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">ATTENDANCE COUNT</label>
          <input
            type="number"
            min="0"
            class="w-full rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300 transition-shadow"
            placeholder="0"
            :value="modelValue.attendanceCount"
            @input="update('attendanceCount', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div class="space-y-2">
          <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">CAMPAIGN</label>
          <input
            type="text"
            class="w-full rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-500 bg-slate-50/30 outline-none"
            :value="modelValue.campaign"
            readonly
          />
        </div>
      </div>

      <!-- Participant List -->
      <div class="space-y-2">
        <label class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">PARTICIPANT LIST</label>
        <textarea
          rows="5"
          class="w-full rounded-md border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-300 resize-none transition-shadow"
          placeholder="Add rows or paste · each row can be converted to a candidate (FR-IS-5)"
          :value="modelValue.participantList"
          @input="update('participantList', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-6">
        <button
          type="button"
          class="rounded border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded bg-[#4A72B2] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#3D5A8F] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="!isValid || isSaving"
          @click="onSave"
        >
          {{ isSaving ? 'Saving...' : 'Save session' }}
        </button>
      </div>
    </div>
  </div>
</template>
