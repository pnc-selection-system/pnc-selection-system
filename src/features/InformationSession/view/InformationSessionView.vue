<script setup lang="ts">
import { ref } from 'vue'
import SessionFilters from '../components/SessionFilters.vue'
import SessionTable from '../components/SessionTable.vue'
import SessionFormPanel from '../components/SessionFormPanel.vue'
import { fetchFilterOptions, fetchPageMeta, fetchSessions, saveSession } from '../service/service'
import { EMPTY_SESSION_FORM, type PageMeta, type Session, type SessionFormData } from '../types/session'
import { DEFAULT_SESSION_FILTERS, type SessionFilterOptions, type SessionFilters as Filters } from '../types/filter'
import { fetchCampaigns } from '@/features/campaign/services/campaign'
import { CampaignStatus } from '@/enums'
import { useDebouncedWatch } from '@/utils/useDebouncedWatch'

const meta = ref<PageMeta>(fetchPageMeta())
const filters = ref<Filters>({ ...DEFAULT_SESSION_FILTERS })
const filterOptions = ref<SessionFilterOptions>(fetchFilterOptions())
const sessions = ref<Session[]>(fetchSessions(filters.value))
const isFormOpen = ref(false)
const activeCampaignYear = ref('')

function emptyForm(): SessionFormData {
  return {
    ...EMPTY_SESSION_FORM,
    campaign: activeCampaignYear.value || String(new Date().getFullYear()),
  }
}

const form = ref<SessionFormData>(emptyForm())

// Fetch the active campaign year and all campaign years on mount
async function loadCampaignData() {
  try {
    const campaigns = await fetchCampaigns()
    // Set available campaign years (sorted descending)
    const years = [...new Set(campaigns.map(c => String(c.year)))].sort().reverse()
    filterOptions.value = { ...filterOptions.value, campaignYears: years }
    // Find active campaign's year
    const active = campaigns.find(c => c.status === CampaignStatus.Active)
    if (active) {
      activeCampaignYear.value = String(active.year)
    }
  } catch {
    // Fallback to current year
    const thisYear = String(new Date().getFullYear())
    activeCampaignYear.value = thisYear
    filterOptions.value = { ...filterOptions.value, campaignYears: [thisYear] }
  }
}
loadCampaignData()

function loadSessions() {
  sessions.value = fetchSessions(filters.value)
}

function selectSession(session: Session) {
  form.value = {
    id: session.id,
    date: session.date,
    province: session.province,
    school: session.school,
    attendanceCount: session.attendance,
    campaign: activeCampaignYear.value || String(new Date().getFullYear()),
    participantList: '',
  }
  isFormOpen.value = true
}

function startNewSession() {
  form.value = emptyForm()
  isFormOpen.value = true
}

function viewCandidates(_session: Session) {
  void _session
  // Hook this up to router navigation, e.g.:
  // router.push({ name: 'candidates', query: { sessionId: session.id } })
  
}

async function handleSave() {
  await saveSession(form.value)
  form.value = emptyForm()
  isFormOpen.value = false
  loadSessions()
}

function handleCancel() {
  form.value = emptyForm()
  isFormOpen.value = false
}  useDebouncedWatch(filters, loadSessions, 300, true)
</script>
<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader
        :breadcrumb="meta?.breadcrumb.join(' / ') || 'Outreach'"
        :title="meta?.title || 'Information sessions'"
      />
      <SessionFilters v-model="filters" :options="filterOptions" @new="startNewSession" />
      <div class="grid grid-cols-1 gap-4 transition-all duration-300" :class="isFormOpen ? 'lg:grid-cols-[1fr_420px]' : 'lg:grid-cols-1'">
        <SessionTable
          :sessions="sessions"
          :selected-id="form.id"
          @select="selectSession"
          @view-candidates="viewCandidates"
        />
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-x-10 opacity-0"
          enter-to-class="transform translate-x-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-x-0 opacity-100"
          leave-to-class="transform translate-x-10 opacity-0"
        >
          <SessionFormPanel
            v-if="isFormOpen"
            v-model="form"
            :options="filterOptions"
            @save="handleSave"
            @cancel="handleCancel"
          />
        </transition>
      </div>
    </div>
  </div>
</template>
