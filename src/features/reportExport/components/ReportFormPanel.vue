<script setup lang="ts">
import { ref, computed } from 'vue'
import { ReportType, ReportFormat, reportTypeLabels, reportFormatLabels } from '../types'
import type { GenerateReportPayload } from '../types'
import { fetchCampaigns } from '@/features/campaign/services/campaign'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  generate: [payload: GenerateReportPayload]
}>()

const selectedType = ref<ReportType>(ReportType.FinalSelectedList)
const selectedFormat = ref<ReportFormat>(ReportFormat.XLSX)
const selectedCampaign = ref('')
const campaigns = ref<string[]>([])
const isLoadingCampaigns = ref(false)

const reportTypeOptions = computed(() =>
  Object.values(ReportType).map((type) => ({
    value: type,
    label: reportTypeLabels[type],
  }))
)

const reportFormatOptions = computed(() =>
  Object.values(ReportFormat).map((format) => ({
    value: format,
    label: reportFormatLabels[format],
  }))
)

async function loadCampaigns() {
  isLoadingCampaigns.value = true
  try {
    const data = await fetchCampaigns()
    const years = [...new Set(data.map((c) => String(c.year)))].sort().reverse()
    campaigns.value = years
    if (years.length > 0 && !selectedCampaign.value) {
      selectedCampaign.value = years[0]
    }
  } catch {
    // Fallback to current year
    const thisYear = String(new Date().getFullYear())
    campaigns.value = [thisYear]
    selectedCampaign.value = thisYear
  } finally {
    isLoadingCampaigns.value = false
  }
}

loadCampaigns()

function handleGenerate() {
  if (!selectedCampaign.value) return
  emit('generate', {
    type: selectedType.value,
    format: selectedFormat.value,
    campaign: selectedCampaign.value,
  })
}
</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-6">
    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
      Generate Report
    </h3>

    <form @submit.prevent="handleGenerate" class="space-y-4">
      <BaseSelect
        v-model="selectedType"
        :options="reportTypeOptions"
        label="Report Type"
        placeholder="Select report type"
      />

      <div class="grid grid-cols-2 gap-4">
        <BaseSelect
          v-model="selectedCampaign"
          :options="campaigns"
          label="Campaign"
          placeholder="Select campaign"
          :disabled="isLoadingCampaigns"
        />

        <BaseSelect
          v-model="selectedFormat"
          :options="reportFormatOptions"
          label="Format"
          placeholder="Select format"
        />
      </div>

      <BaseButton type="submit" variant="primary" class="w-full mt-6" :loading="props.loading">
        Generate report
      </BaseButton>
    </form>
  </div>
</template>
