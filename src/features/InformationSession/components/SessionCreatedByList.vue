<script setup lang="ts">
defineProps<{
  items: { name: string }[]
  inputValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  remove: [index: number]
  'update:inputValue': [value: string]
}>()
</script>

<template>
  <div class="space-y-2 pt-1">
    <label class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">CREATED BY</label>

    <!-- Added names as rows -->
    <div
      v-for="(item, index) in items"
      :key="'cb-' + index"
      class="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2"
    >
      <span class="flex-1 text-sm text-slate-700">{{ item.name }}</span>
      <button
        type="button"
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        title="Remove creator"
        @click="emit('remove', index)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Input field -->
    <input
      type="text"
      :value="inputValue"
      class="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      :placeholder="placeholder || 'Enter creator name'"
      @input="emit('update:inputValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
