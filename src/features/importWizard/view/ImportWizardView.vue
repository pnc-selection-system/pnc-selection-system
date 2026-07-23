<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import WizardSteps from '../components/WizadSteps.vue'
import SubjectStep from '../components/SubjectStep.vue'
import UploadStep from '../components/UploadStep.vue'
import MapColumnsStep from '../components/MapColumnsStep.vue'
import ValidateStep from '../components/ValidateStep.vue'
import CommitStep from '../components/CommitStep.vue'
import {
  SYSTEM_FIELDS,
  commitImport,
  parseUploadedFile,
  runValidation,
} from '../service/service'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { useCacheFetch } from '@/composables/useCacheFetch'
import type { Campaign } from '@/features/campaign/types'
import { CampaignStatus } from '@/enums'
import type { WizardStepKey } from '../types/wizard'
import type { ColumnMapping, CommitSummary, UploadedFile, ValidationResult, SubjectRule } from '../types/mapping'

const router = useRouter()

const CACHE_KEY = 'pnc_import_wizard_data'

interface WizardCache {
  currentStep: WizardStepKey
  selectedSubjectId: number | null
  selectedSubjectName: string
  selectedCampaignId: number | null
}

function loadCache(): WizardCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as WizardCache) : null
  } catch {
    return null
  }
}

function saveCache(data: WizardCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // silently ignore
  }
}

const cached = loadCache()

const currentStep = ref<WizardStepKey>(cached?.currentStep ?? 'subject')
const selectedSubjectId = ref<number | null>(cached?.selectedSubjectId ?? null)
const selectedSubjectName = ref(cached?.selectedSubjectName ?? '')
const selectedCampaignId = ref<number | null>(cached?.selectedCampaignId ?? null)

// Auto-select campaign from cache or fetch fresh list
const { data: campaigns } = useCacheFetch<Campaign[]>(
  'campaigns',
  () => fetchCampaigns(),
  { ttl: 60_000 },
)

if (!cached) {
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
}

// Persist wizard state whenever the step changes
watch(currentStep, () => {
  persistWizardState()
})

const uploadedFile = ref<UploadedFile | null>(null)
const mappings = ref<ColumnMapping[]>([])
const validation = ref<ValidationResult | null>(null)
const commitSummary = ref<CommitSummary | null>(null)
const importFileId = ref<number | null>(null)
const subjectRules = ref<SubjectRule[]>([])

function persistWizardState() {
  saveCache({
    currentStep: currentStep.value,
    selectedSubjectId: selectedSubjectId.value,
    selectedSubjectName: selectedSubjectName.value,
    selectedCampaignId: selectedCampaignId.value,
  })
}

function handleSubjectProceed(subjectId: number, subjectName: string) {
  selectedSubjectId.value = subjectId
  selectedSubjectName.value = subjectName
  currentStep.value = 'upload'
  persistWizardState()
}

async function handleUpload(file: File) {
  if (!selectedCampaignId.value || !selectedSubjectId.value) {
    alert('Campaign and subject must be selected')
    return
  }

  try {
    const result = await parseUploadedFile(file, selectedCampaignId.value, selectedSubjectId.value)
    uploadedFile.value = result.file
    mappings.value = result.mappings
    importFileId.value = result.importFileId
    subjectRules.value = result.subjectRules
    currentStep.value = 'map'
  } catch (error: any) {
    console.error('Upload failed:', error)
    alert(`Upload failed: ${error.message}`)
  }
}

async function handleRunValidation() {
  if (!importFileId.value || !selectedSubjectId.value) {
    alert('Import file ID and subject ID are required')
    return
  }

  currentStep.value = 'validate'
  validation.value = null
  try {
    validation.value = await runValidation(mappings.value, importFileId.value, selectedSubjectId.value)
    // Merge subject rules from validation response if available
    if (validation.value.subjectRules && validation.value.subjectRules.length > 0) {
      subjectRules.value = validation.value.subjectRules
    }
  } catch (error: any) {
    console.error('Validation failed:', error)
    alert(`Validation failed: ${error.message}`)
  }
}

async function handleCommit() {
  if (!importFileId.value || !selectedSubjectId.value) {
    alert('Import file ID and subject ID are required')
    return
  }

  currentStep.value = 'commit'
  commitSummary.value = null

  commitSummary.value = await commitImport(importFileId.value, mappings.value, selectedSubjectId.value)
}

function goToResults() {
  // Clear wizard cache so it starts fresh next time
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // silently ignore
  }
  router.push('/exam/results')
}
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
        :subject-rules="subjectRules"
        @back="currentStep = 'map'"
        @commit="handleCommit"
      />

      <CommitStep v-else-if="currentStep === 'commit'" :summary="commitSummary" @done="goToResults" />
    </div>
  </div>
</template>
