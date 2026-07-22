<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import WizardSteps from '../components/WizadSteps.vue'
import SubjectStep from '../components/SubjectStep.vue'
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
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { useCacheFetch } from '@/composables/useCacheFetch'
import type { Campaign } from '@/features/campaign/types'
import { CampaignStatus } from '@/enums'
import type { PageMeta, WizardStepKey } from '../types/wizard'
import type { ColumnMapping, CommitSummary, UploadedFile, ValidationResult } from '../types/mapping'

const meta = ref<PageMeta | null>(null)
const currentStep = ref<WizardStepKey>('subject')

const selectedSubjectId = ref<number | null>(null)
const selectedSubjectName = ref('')
const selectedCampaignId = ref<number | null>(null)

// Auto-select campaign
const { data: campaigns } = useCacheFetch<Campaign[]>(
  'campaigns',
  () => fetchCampaigns(),
  { ttl: 60_000 },
)

watch(campaigns, (list) => {
  if (!list || list.length === 0) return
  const activeCampaign = list.find(c => c.status === CampaignStatus.Active)
  if (activeCampaign) {
    selectedCampaignId.value = activeCampaign.id
  } else {
    const first = list[0]
    if (first) {
      selectedCampaignId.value = first.id
    }
  }
}, { immediate: true })

watch(currentStep, async (newStep) => {
  if (newStep === 'validate' && !validation.value) {
    try {
      validation.value = await runValidation(mappings.value)
    } catch (error) {
      console.error('Failed to load validation:', error)
    }
  }
})

const uploadedFile = ref<UploadedFile | null>(null)
const mappings = ref<ColumnMapping[]>([])
const validation = ref<ValidationResult | null>(null)
const commitSummary = ref<CommitSummary | null>(null)
const importFileId = ref<number | null>(null)

function handleSubjectProceed(subjectId: number, subjectName: string) {
  selectedSubjectId.value = subjectId
  selectedSubjectName.value = subjectName
  currentStep.value = 'upload'
}

async function handleUpload(file: File) {
  if (!selectedCampaignId.value || !selectedSubjectId.value) {
    alert('Campaign and subject must be selected')
    return
  }

  console.log('Uploading file with:', {
    campaignId: selectedCampaignId.value,
    subjectId: selectedSubjectId.value,
    fileName: file.name
  })

  try {
    const result = await parseUploadedFile(file, selectedCampaignId.value, selectedSubjectId.value)
    uploadedFile.value = result.file
    mappings.value = result.mappings
    importFileId.value = result.importFileId
    currentStep.value = 'map'
  } catch (error: any) {
    console.error('Upload failed:', error)
    alert(`Upload failed: ${error.message}`)
  }
}

async function handleRunValidation() {
  currentStep.value = 'validate'
  validation.value = null
  validation.value = await runValidation(mappings.value)
}

async function handleCommit() {
  if (!importFileId.value || !selectedSubjectId.value) {
    alert('Import file ID and subject ID are required')
    return
  }

  currentStep.value = 'commit'
  commitSummary.value = null
  
  // Convert mappings to column mapping format
  const columnMapping: Record<string, string> = {}
  mappings.value.forEach(m => {
    if (m.mappedTo !== 'Ignore') {
      columnMapping[m.fileColumn] = m.mappedTo
    }
  })

  commitSummary.value = await commitImport(importFileId.value, columnMapping, selectedSubjectId.value)
}

function resetWizard() {
  currentStep.value = 'subject'
  selectedSubjectId.value = null
  selectedSubjectName.value = ''
  uploadedFile.value = null
  mappings.value = []
  validation.value = null
  commitSummary.value = null
  importFileId.value = null
}

onMounted(async () => {
  meta.value = await fetchPageMeta()
})
</script>

<template>
  <div class="min-h-screen px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <WizardSteps :current="currentStep" @select="currentStep = $event" />

      <!-- Selected subject context banner -->
      <div
        v-if="selectedSubjectName && currentStep !== 'subject'"
        class="flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm"
      >
        <span class="font-medium text-blue-800">Subject: {{ selectedSubjectName }}</span>
        <span class="ml-auto">
          <button
            type="button"
            class="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
            @click="currentStep = 'subject'"
          >
            Change subject
          </button>
        </span>
      </div>

      <SubjectStep 
        v-if="currentStep === 'subject'" 
        :campaign-id="selectedCampaignId"
        @proceed="handleSubjectProceed" 
      />

      <UploadStep v-else-if="currentStep === 'upload'" @uploaded="handleUpload" />

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