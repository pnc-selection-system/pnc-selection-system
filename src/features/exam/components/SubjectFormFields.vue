<script setup lang="ts">
defineProps<{
  form: { name: string; maxScore: number; weight: number }
  errors: Record<string, string>
  nameStatus: 'empty' | 'valid' | 'invalid' | 'duplicate'
  nameStatusMessage: string
  saving: boolean
  serverError?: string | null
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:maxScore': [value: number]
  'update:weight': [value: number]
}>()
</script>

<template>
  <div class="space-y-5">
    <!-- Server/Form Error -->
    <div
      v-if="serverError"
      class="rounded border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
    >
      {{ serverError }}
    </div>

    <!-- Subject Name -->
    <div>
      <label for="subjectName" class="mb-2 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
        Subject Name <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          id="subjectName"
          :value="form.name"
          type="text"
          :disabled="saving"
          :class="[
            'w-full rounded border px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400',
            errors.name
              ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : nameStatus === 'duplicate'
                ? 'border-amber-300 bg-amber-50/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
                : 'border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
          ]"
          placeholder="e.g., Mathematics, Physics"
          maxlength="50"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        />
        <div
          v-if="form.name && !errors.name"
          :class="[
            'absolute right-3 top-1/2 -translate-y-1/2',
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
      <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      <p v-else-if="nameStatusMessage" class="mt-1 text-xs text-amber-600">{{ nameStatusMessage }}</p>
      <p v-else class="mt-1 text-xs text-slate-400">Only letters, spaces, hyphens and underscores (no numbers)</p>
    </div>

    <!-- Max Score -->
    <div>
      <label for="maxScore" class="mb-2 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
        Max Score <span class="text-red-500">*</span>
      </label>
      <input
        id="maxScore"
        :value="form.maxScore"
        type="number"
        min="1"
        max="1000"
        :disabled="saving"
        :class="[
          'w-full rounded border px-3 py-2 text-sm text-slate-700 outline-none transition',
          errors.maxScore
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
        ]"
        placeholder="100"
        @input="emit('update:maxScore', Number(($event.target as HTMLInputElement).value))"
      />
      <p v-if="errors.maxScore" class="mt-1 text-xs text-red-500">{{ errors.maxScore }}</p>
    </div>

    <!-- Weight -->
    <div>
      <label for="weight" class="mb-2 block text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
        Weight <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          id="weight"
          :value="form.weight"
          type="number"
          min="0"
          max="100"
          :disabled="saving"
          :class="[
            'w-full rounded border px-3 py-2 pr-8 text-sm text-slate-700 outline-none transition',
            errors.weight
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
          ]"
          placeholder="0"
          @input="emit('update:weight', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
      </div>
      <p v-if="errors.weight" class="mt-1 text-xs text-red-500">{{ errors.weight }}</p>
    </div>
  </div>
</template>
