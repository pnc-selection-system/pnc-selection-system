<script setup lang="ts">
defineProps<{
  hosts: { name: string }[]
  label?: string
  placeholder?: string
  addButtonText?: string
}>()

const emit = defineEmits<{
  add: []
  remove: [index: number]
  update: [index: number, name: string]
}>()
</script>

<template>
  <div class="space-y-2 pt-1">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">
      {{ label || 'HOST BY' }}
    </label>

    <div
      v-for="(host, index) in hosts"
      :key="index"
      class="flex items-center gap-2"
    >
      <input
        type="text"
        :value="host.name"
        class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        :placeholder="placeholder || 'Host by'"
        @input="emit('update', index, ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        title="Remove host"
        @click="emit('remove', index)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
      @click="emit('add')"
    >
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {{ addButtonText || 'Add host' }}
    </button>
  </div>
</template>
