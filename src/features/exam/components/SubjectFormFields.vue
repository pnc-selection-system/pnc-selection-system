<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'

defineProps<{
  form: { name: string; maxScore: number; weight: number }
  errors: Record<string, string>
  nameStatus: 'empty' | 'valid' | 'invalid' | 'duplicate'
  nameStatusMessage: string
  saving: boolean
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:maxScore': [value: number]
  'update:weight': [value: number]
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Subject Name (custom: needs validation icon overlay) -->
    <div>
      <label class="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500">
        Subject Name <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          :value="form.name"
          type="text"
          :disabled="saving"
          :class="[
            'w-full rounded border px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            errors.name
              ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : nameStatus === 'duplicate'
                ? 'border-amber-300 bg-amber-50/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
                : 'border-slate-300 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
          ]"
          placeholder="e.g., Mathematics, Physics"
          maxlength="50"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        />
        <div
          v-if="form.name && !errors.name"
          :class="[
            'absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200',
            nameStatus === 'valid' ? 'text-emerald-500' : '',
            nameStatus === 'duplicate' ? 'text-amber-500' : '',
          ]"
        >
          <svg
            v-if="nameStatus === 'valid'"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <svg
            v-else-if="nameStatus === 'duplicate'"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
      </div>
      <p v-if="errors.name" class="mt-1.5 text-xs text-red-500">{{ errors.name }}</p>
      <p v-else-if="nameStatusMessage" class="mt-1.5 text-xs text-amber-600">{{ nameStatusMessage }}</p>
    </div>

    <!-- Max Score & Weight grid -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Max Score -->
      <div>
        <BaseInput
          :model-value="String(form.maxScore)"
          label="Max Score *"
          type="number"
          min="1"
          max="1000"
          placeholder="100"
          :disabled="saving"
          @update:model-value="emit('update:maxScore', Number($event))"
        />
        <p v-if="errors.maxScore" class="mt-1.5 text-xs text-red-500">{{ errors.maxScore }}</p>
      </div>

      <!-- Weight -->
      <div>
        <label class="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-500">
          Weight <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            :value="form.weight"
            type="number"
            min="0"
            max="100"
            :disabled="saving"
            :class="[
              'w-full rounded border px-3.5 py-2.5 pr-8 text-sm text-slate-700 outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              errors.weight
                ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-slate-300 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
            ]"
            placeholder="0"
            @input="emit('update:weight', Number(($event.target as HTMLInputElement).value))"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none">%</span>
        </div>
        <p v-if="errors.weight" class="mt-1.5 text-xs text-red-500">{{ errors.weight }}</p>
      </div>
    </div>
  </div>
</template>
