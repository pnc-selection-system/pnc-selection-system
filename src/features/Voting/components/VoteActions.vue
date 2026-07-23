<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import type { VoteChoice } from '../types/vote'

const props = defineProps<{
  selected?: VoteChoice
  comment: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  vote: [choice: VoteChoice]
  'update:comment': [value: string]
}>()

const options: { choice: VoteChoice; icon: string; activeClasses: string }[] = [
  { choice: 'Approve', icon: '✓', activeClasses: '!border-green-400 !bg-green-50 !text-green-700' },
  { choice: 'Reject', icon: '✗', activeClasses: '!border-rose-400 !bg-rose-50 !text-rose-700' },
  { choice: 'Abstain', icon: '○', activeClasses: '!border-slate-400 !bg-slate-100 !text-slate-700' },
]
</script>

<template>
  <div class="flex flex-wrap items-end gap-4 border-t border-slate-100 px-6 py-5">
    <div class="flex gap-2">
      <BaseButton
        v-for="opt in options"
        :key="opt.choice"
        variant="outline"
        :disabled="disabled"
        :class="selected === opt.choice ? opt.activeClasses : '!border-slate-200 !text-slate-600 hover:!bg-slate-50'"
        @click="emit('vote', opt.choice)"
      >
        {{ opt.icon }} {{ opt.choice }}
      </BaseButton>
    </div>

    <div class="min-w-[240px] flex-1">
      <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Comment</label>
      <input
        type="text"
        class="mt-1.5 w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
        placeholder="Optional rationale..."
        :value="comment"
        :disabled="disabled"
        @input="emit('update:comment', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>