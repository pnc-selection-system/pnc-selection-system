<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import PhotoDocumentGrid from './PhotoDocumentGrid.vue'
import type { Attachment } from '../types/attachment'
import type { VisitDetail } from '../types/visit'

const props = defineProps<{
  modelValue: VisitDetail
  attachments: Attachment[]
  saving?: boolean
  submitting?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: VisitDetail]
  addAttachment: [file: File]
  removeAttachment: [attachment: Attachment]
  saveDraft: []
  submit: []
}>()

const isSubmitted = computed(() => props.modelValue.status === 'Submitted')

function update<K extends keyof VisitDetail>(key: K, value: VisitDetail[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="space-y-5 px-6 py-5">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Visit date</label>
        <input
          type="date"
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="dd / mm / yyyy"
          :value="modelValue.visitDate"
          @input="update('visitDate', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div>
        <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Location</label>
        <input
          type="text"
          class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="GPS / address"
          :value="modelValue.location"
          @input="update('location', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div>
      <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">People met</label>
      <input
        type="text"
        class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        placeholder="e.g. Mother, younger sibling"
        :value="modelValue.peopleMet"
        @input="update('peopleMet', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div>
      <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Observations</label>
      <textarea
        rows="3"
        class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        placeholder="Household conditions, environment, concerns..."
        :value="modelValue.observations"
        @input="update('observations', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div>
      <label class="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">Findings & recommendation</label>
      <textarea
        rows="3"
        class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        placeholder="Structured summary + recommend / not recommend"
        :value="modelValue.findings"
        @input="update('findings', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div class="border-t border-slate-100 pt-5">
      <PhotoDocumentGrid
        :attachments="attachments"
        @add="emit('addAttachment', $event)"
        @remove="emit('removeAttachment', $event)"
      />
    </div>

    <div class="flex items-center justify-between border-t border-slate-100 pt-5">
      <BaseButton
        variant="secondary"
        class="!w-auto"
        :loading="saving"
        :disabled="saving || submitting"
        @click="emit('saveDraft')"
      >
        {{ saving ? 'Saving...' : 'Save draft' }}
      </BaseButton>
      <BaseButton
        class="!w-auto"
        :loading="submitting"
        :disabled="saving || submitting || isSubmitted"
        @click="emit('submit')"
      >
        {{ submitting ? 'Submitting...' : isSubmitted ? 'Already submitted' : 'Submit for review' }}
      </BaseButton>
    </div>
  </div>
</template>