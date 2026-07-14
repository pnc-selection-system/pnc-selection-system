<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import WizardSteps from '../components/WizadSteps.vue'
import UploadStep from '../components/UploadStep.vue'
import MapColumnsStep from '../components/MapColumnsStep.vue'
import ValidateStep from '../components/ValidateStep.vue'
import CommitStep from '../components/CommitStep.vue'
import {
  SYSTEM_FIELDS,
  commitImport,
  fetchPageMeta,
  parseUploadedFile,
  runValidation,
} from '../service/service'
import type { PageMeta, WizardStepKey } from '../types/wizard'
import type { ColumnMapping, CommitSummary, UploadedFile, ValidationResult } from '../types/mapping'

const meta = ref<PageMeta | null>(null)
const currentStep = ref<WizardStepKey>('upload')

const uploadedFile = ref<UploadedFile | null>(null)
const mappings = ref<ColumnMapping[]>([])
const validation = ref<ValidationResult | null>({
  totalRows: 128,
  validRows: 121,
  issues: [
    { row: 57, column: 'StudentID', message: 'Unmatched StudentID "C-9999"', type: 'error' },
    { row: 112, column: 'ID', message: 'Duplicate ID — keeps highest score', type: 'warning' },
    { row: 340, column: 'Math_raw', message: 'Math_raw "abc" not numeric', type: 'error' },
  ],
})
const commitSummary = ref<CommitSummary | null>(null)

watch(currentStep, async (newStep) => {
  if (newStep === 'validate' && !validation.value) {
    try {
      validation.value = await runValidation(mappings.value)
      console.log('Validation loaded:', validation.value)
    } catch (error) {
      console.error('Failed to load validation:', error)
    }
  }
})

async function handleUpload(file: File) {
  const result = await parseUploadedFile(file)
  uploadedFile.value = result.file
  mappings.value = result.mappings
  currentStep.value = 'map'
}

async function handleRunValidation() {
  currentStep.value = 'validate'
  validation.value = null
  validation.value = await runValidation(mappings.value)
}

async function handleCommit() {
  currentStep.value = 'commit'
  commitSummary.value = null
  commitSummary.value = await commitImport()
}

function resetWizard() {
  currentStep.value = 'upload'
  uploadedFile.value = null
  mappings.value = []
  validation.value = null
  commitSummary.value = null
}

onMounted(async () => {
  meta.value = await fetchPageMeta()
  // Pre-populate validation data so it's available when navigating to validate step
  if (!validation.value) {
    validation.value = await runValidation(mappings.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <WizardSteps :current="currentStep" @select="currentStep = $event" />

      <UploadStep v-if="currentStep === 'upload'" @uploaded="handleUpload" />

      <MapColumnsStep
        v-else-if="currentStep === 'map'"
        v-model:mappings="mappings"
        :system-fields="SYSTEM_FIELDS"
        @back="currentStep = 'upload'"
        @run-validation="handleRunValidation"
      />

      <ValidateStep
        v-else-if="currentStep === 'validate'"
        :result="validation"
        @back="currentStep = 'map'"
        @commit="handleCommit"
      />

      <CommitStep v-else-if="currentStep === 'commit'" :summary="commitSummary" @done="resetWizard" />
    </div>
  </div>
</template>