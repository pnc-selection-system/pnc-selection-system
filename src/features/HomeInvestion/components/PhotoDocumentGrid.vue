<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { Attachment } from '../types/attachment'

defineProps<{
  attachments: Attachment[]
}>()

const emit = defineEmits<{
  add: [file: File]
  remove: [attachment: Attachment]
}>()

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('add', file)
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <div>
    <p class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Photos & documents
    </p>

    <div class="mt-3 flex flex-wrap gap-3">
      <div
        v-for="attachment in attachments"
        :key="attachment.id"
        class="group relative h-20 w-20 rounded-md border border-slate-200 overflow-hidden"
        :class="attachment.type === 'image' && attachment.url ? '' : 'border-dashed border-slate-300'"
      >
        <img
          v-if="attachment.type === 'image' && attachment.url"
          :src="attachment.url"
          :alt="attachment.name"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-slate-400"
        >
          <span>{{ attachment.type === 'image' ? 'IMG' : 'DOC' }}</span>
        </div>
        <BaseButton
          class="!absolute !right-0.5 !top-0.5 !flex !h-5 !w-5 !items-center !justify-center !rounded-full !bg-black/40 !p-0 !text-white !opacity-0 !transition-opacity hover:!bg-black/60 group-hover:!opacity-100 !border-0 !min-w-0 !shadow-none"
          @click="emit('remove', attachment)"
        >
          <svg class="h-3 w-3" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </BaseButton>
      </div>

      <label class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-blue-300 text-xs text-blue-600 hover:bg-blue-50">
        <span>+ Add</span>
        <input type="file" accept="image/*,application/pdf" class="hidden" @change="handleFileChange" />
      </label>
    </div>
  </div>
</template>