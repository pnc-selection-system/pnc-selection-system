import { ref, computed } from 'vue'
import type { Campaign } from '../types'

const campaigns = ref<Campaign[]>([
  {
    id: '1',
    name: 'BEM Chairman Election 2025',
    description: 'Election for the Student Executive Board chairman for 2025/2026 period',
    startDate: '2025-08-01',
    endDate: '2025-08-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Department Association Election 2025',
    description: 'Election for the department student association chairman',
    startDate: '2025-09-01',
    endDate: '2025-09-10',
    status: 'draft',
  },
  {
    id: '3',
    name: 'Student Senate Election 2024',
    description: 'Student senate election for the 2024/2025 period',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    status: 'closed',
  },
  {
    id: '4',
    name: 'Student Activity Unit Election 2025',
    description: 'Election for the student activity unit chairman',
    startDate: '2025-10-01',
    endDate: '2025-10-10',
    status: 'draft',
  },
])

const searchQuery = ref('')
const statusFilter = ref<string>('all')
const showInfoBox = ref(true)

const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    const matchesStatus = statusFilter.value === 'all' || c.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

export function useCampaigns() {
  function deleteCampaign(id: string) {
    campaigns.value = campaigns.value.filter((c) => c.id !== id)
  }

  function updateCampaign(updated: Campaign) {
    const idx = campaigns.value.findIndex((c) => c.id === updated.id)
    if (idx !== -1) {
      campaigns.value[idx] = { ...updated }
    }
  }

  function addCampaign(campaign: Campaign) {
    campaigns.value.unshift({ ...campaign })
  }

  function getStatusCount(status: Campaign['status'] | 'all') {
    if (status === 'all') return campaigns.value.length
    return campaigns.value.filter((c) => c.status === status).length
  }

  function dismissInfoBox() {
    showInfoBox.value = false
  }

  return {
    campaigns,
    searchQuery,
    statusFilter,
    showInfoBox,
    filteredCampaigns,
    deleteCampaign,
    updateCampaign,
    addCampaign,
    getStatusCount,
    dismissInfoBox,
  }
}
