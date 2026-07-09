import { ref, computed } from 'vue'
import type { Campaign, CampaignPayload } from '../types'
import * as campaignService from '../services/campaign'

const campaigns = ref<Campaign[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const statusFilter = ref<string>('all')
const yearFilter = ref<string>('all')
const showInfoBox = ref(true)

const yearOptions = computed(() => {
  const years = new Set(campaigns.value.map((c) => c.year.toString()))
  return Array.from(years).sort().reverse()
})

const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || c.name.toLowerCase().includes(q)
    const matchesStatus = statusFilter.value === 'all' || c.status === statusFilter.value
    const matchesYear = yearFilter.value === 'all' || c.year.toString() === yearFilter.value
    return matchesSearch && matchesStatus && matchesYear
  })
})

export function useCampaigns() {
  async function loadCampaigns() {
    loading.value = true
    error.value = null
    try {
      campaigns.value = await campaignService.fetchCampaigns()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load campaigns'
    } finally {
      loading.value = false
    }
  }

  async function deleteCampaign(id: number) {
    deleting.value = true
    try {
      await campaignService.deleteCampaign(id)
      campaigns.value = campaigns.value.filter((c) => c.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete campaign'
    } finally {
      deleting.value = false
    }
  }

  async function updateCampaign(id: number, payload: Partial<CampaignPayload>) {
    saving.value = true
    try {
      const updated = await campaignService.updateCampaign(id, payload)
      const idx = campaigns.value.findIndex((c) => c.id === id)
      if (idx !== -1) {
        campaigns.value[idx] = updated
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update campaign'
    } finally {
      saving.value = false
    }
  }

  async function addCampaign(payload: CampaignPayload) {
    saving.value = true
    try {
      const created = await campaignService.createCampaign(payload)
      campaigns.value.unshift(created)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create campaign'
    } finally {
      saving.value = false
    }
  }

  function getStatusCount(status: Campaign['status'] | 'all') {
    if (status === 'all') return campaigns.value.length
    return campaigns.value.filter((c) => c.status === status).length
  }

  function dismissInfoBox() {
    showInfoBox.value = false
  }

  return {
    saving,
    deleting,
    campaigns,
    loading,
    error,
    searchQuery,
    statusFilter,
    yearFilter,
    yearOptions,
    showInfoBox,
    filteredCampaigns,
    loadCampaigns,
    deleteCampaign,
    updateCampaign,
    addCampaign,
    getStatusCount,
    dismissInfoBox,
  }
}
