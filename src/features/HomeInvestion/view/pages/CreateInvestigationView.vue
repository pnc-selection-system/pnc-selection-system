<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import {
  createInvestigation,
  fetchCampaigns,
  fetchInvestigators,
} from '../../service/investigationService'
import type { Investigation } from '../../types/investigation'

const router = useRouter()

const loading = ref(false)
const campaigns = ref<string[]>([])
const investigators = ref<{ id: string; name: string }[]>([])
const form = ref<Partial<Investigation>>({
  candidateName: '',
  campaign: '',
  scheduledDate: '',
  investigatorId: '',
})

onMounted(async () => {
  try {
    campaigns.value = await fetchCampaigns()
    investigators.value = await fetchInvestigators()
  } catch (error) {
    console.error('Failed to load form data:', error)
  }
})

async function handleSave() {
  if (!form.value.candidateName || !form.value.campaign || !form.value.scheduledDate) {
    alert('Please fill in all required fields')
    return
  }

  loading.value = true
  try {
    const investigator = investigators.value.find((i) => i.id === form.value.investigatorId)
    const investigation = await createInvestigation({
      candidateName: form.value.candidateName,
      campaign: form.value.campaign,
      scheduledDate: form.value.scheduledDate,
      investigatorId: form.value.investigatorId,
      investigatorName: investigator?.name,
    })
    router.push(`/evaluation/home-investigation/${investigation.id}`)
  } catch (error) {
    console.error('Failed to create investigation:', error)
    alert('Failed to create investigation')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push('/evaluation/home-investigation')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Create Investigation</h1>
      <p class="mt-1 text-sm text-slate-600">Create a new home investigation</p>
    </div>

    <div class="rounded-lg border border-slate-200 bg-white p-6">
      <div class="space-y-6">
        <div>
          <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
            Candidate Name *
          </label>
          <input
            v-model="form.candidateName"
            type="text"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Enter candidate name"
          />
        </div>

        <div>
          <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
            Campaign *
          </label>
          <select
            v-model="form.campaign"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select a campaign</option>
            <option v-for="campaign in campaigns" :key="campaign" :value="campaign">
              {{ campaign }}
            </option>
          </select>
        </div>

        <div>
          <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
            Assign Investigator
          </label>
          <select
            v-model="form.investigatorId"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select an investigator</option>
            <option v-for="investigator in investigators" :key="investigator.id" :value="investigator.id">
              {{ investigator.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block font-mono text-xs font-medium uppercase tracking-wider text-slate-400">
            Scheduled Date *
          </label>
          <input
            v-model="form.scheduledDate"
            type="date"
            class="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <BaseButton variant="secondary" @click="handleCancel">
            Cancel
          </BaseButton>
          <BaseButton :loading="loading" @click="handleSave">
            Save
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>