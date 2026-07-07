<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import SessionFilters from '../components/SessionFilters.vue'
import SessionTable from '../components/SessionTable.vue'
import SessionFormPanel from '../components/SessionFormPanel.vue'
import SessionSkeleton from '../components/SessionSkeleton.vue'
import { fetchFilterOptions, fetchPageMeta, fetchSessions, saveSession } from '../service/service'
import { EMPTY_SESSION_FORM, type PageMeta, type Session, type SessionFormData } from '../types/session'
import { DEFAULT_SESSION_FILTERS, type SessionFilterOptions, type SessionFilters as Filters } from '../types/filter'

const loading = ref(true)
const meta = ref<PageMeta | null>(null)
const filters = ref<Filters>({ ...DEFAULT_SESSION_FILTERS })
const filterOptions = ref<SessionFilterOptions>({ provinces: [], schools: [], dateRanges: [] })
const sessions = ref<Session[]>([])
const form = ref<SessionFormData>({ ...EMPTY_SESSION_FORM })
const isFormOpen = ref(false)

async function loadSessions() {
  loading.value = true
  sessions.value = await fetchSessions(filters.value)
  loading.value = false
}

function selectSession(session: Session) {
  form.value = {
    id: session.id,
    date: session.date,
    province: session.province,
    school: session.school,
    attendanceCount: session.attendance,
    campaign: '2026',
    participantList: '',
  }
  isFormOpen.value = true
}

function startNewSession() {
  form.value = { ...EMPTY_SESSION_FORM }
  isFormOpen.value = true
}

function viewCandidates(session: Session) {
  // Hook this up to router navigation, e.g.:
  // router.push({ name: 'candidates', query: { sessionId: session.id } })
  console.log('view candidates for', session.id)
}

async function handleSave() {
  await saveSession(form.value)
  form.value = { ...EMPTY_SESSION_FORM }
  isFormOpen.value = false
  await loadSessions()
}

function handleCancel() {
  form.value = { ...EMPTY_SESSION_FORM }
  isFormOpen.value = false
}
onMounted(async () => {
  meta.value = await fetchPageMeta()
  filterOptions.value = await fetchFilterOptions()
  await loadSessions()
})
watch(filters, loadSessions, { deep: true })
</script>
<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="mx-auto max-w-6xl space-y-4">
      <PageHeader v-if="meta" :meta="meta" />
      <SessionFilters v-model="filters" :options="filterOptions" @new="startNewSession" />
      <SessionSkeleton v-if="loading" />

      <div v-else class="grid grid-cols-1 gap-4 transition-all duration-300" :class="isFormOpen ? 'lg:grid-cols-[1fr_420px]' : 'lg:grid-cols-1'">
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