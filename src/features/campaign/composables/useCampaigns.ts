import { ref, computed } from 'vue'
import type { Campaign, CampaignPayload } from '../types'
import * as campaignService from '../services/campaign'
import { getErrorMessage } from '@/utils/error'

const CAMPAIGNS_SESSION_KEY = 'campaigns'

function readCampaignsFromStorage(): Campaign[] | null {
  try {
    const raw = sessionStorage.getItem(CAMPAIGNS_SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch {}
  return null
}

function writeCampaignsToStorage(data: Campaign[]): void {
  try {
    sessionStorage.setItem(CAMPAIGNS_SESSION_KEY, JSON.stringify(data))
  } catch {}
}

function removeCampaignsFromStorage(): void {
  try {
    sessionStorage.removeItem(CAMPAIGNS_SESSION_KEY)
  } catch {}
}

let initialized = false

const campaigns = ref<Campaign[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref('')
const statusFilter = ref<string>('all')
const yearFilter = ref<string>('all')

const yearOptions = computed(() => {
  if (!Array.isArray(campaigns.value)) return []
  const years = new Set(campaigns.value.map((c) => c.year.toString()))
  return Array.from(years).sort().reverse()
})

const filteredCampaigns = computed(() => {
  if (!Array.isArray(campaigns.value)) return []
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
      writeCampaignsToStorage(campaigns.value)
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to load campaigns')
    } finally {
      loading.value = false
    }
  }

  async function deleteCampaign(id: number) {
    deleting.value = true
    try {
      await campaignService.deleteCampaign(id)
      if (Array.isArray(campaigns.value)) {
        campaigns.value = campaigns.value.filter((c) => c.id !== id)
        writeCampaignsToStorage(campaigns.value)
      }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to delete campaign')
    } finally {
      deleting.value = false
    }
  }

  async function updateCampaign(id: number, payload: Partial<CampaignPayload>) {
    saving.value = true
    try {
      const updated = await campaignService.updateCampaign(id, payload)
      if (Array.isArray(campaigns.value)) {
        const idx = campaigns.value.findIndex((c) => c.id === id)
        if (idx !== -1) {
          campaigns.value[idx] = updated
          writeCampaignsToStorage(campaigns.value)
        }
      }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to update campaign')
    } finally {
      saving.value = false
    }
  }

  async function addCampaign(payload: CampaignPayload) {
    saving.value = true
    try {
      const created = await campaignService.createCampaign(payload)
      if (Array.isArray(campaigns.value)) {
        campaigns.value.unshift(created)
      } else {
        campaigns.value = [created]
      }
      writeCampaignsToStorage(campaigns.value)
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to create campaign')
    } finally {
      saving.value = false
    }
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
    filteredCampaigns,
    loadCampaigns,
    deleteCampaign,
    updateCampaign,
    addCampaign,
  }
}

// Hydrate from sessionStorage on module load so the first render is instant
if (!initialized) {
  const cached = readCampaignsFromStorage()
  if (cached) {
    campaigns.value = cached
  }
  initialized = true
}
