<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import SessionFilters from '../components/SessionFilters.vue'
import SessionTable from '../components/SessionTable.vue'
import NewSessionPanel from '../components/NewSessionPanel.vue'
import SessionsSkeleton from '../components/SessionSkeleton.vue'
import { fetchFilterOptions, fetchPageMeta, fetchSessions, saveSession } from '../service/service'
import { EMPTY_SESSION_FORM, type PageMeta, type Session, type SessionFormData } from '../types/session'
import { DEFAULT_SESSION_FILTERS, type SessionFilterOptions, type SessionFilters as Filters } from '../types/filter'

const loading = ref(true)
const meta = ref<PageMeta | null>(null)
const filters = ref<Filters>({ ...DEFAULT_SESSION_FILTERS })
const filterOptions = ref<SessionFilterOptions>({ provinces: [], schools: [], pncNgoOptions: [], dateRanges: [] })
const sessions = ref<Session[]>([])
const isPanelOpen = ref(false)
const form = ref<SessionFormData>({ ...EMPTY_SESSION_FORM })
const selectedSessionId = ref<string | null>(null)
let filterTimer: ReturnType<typeof setTimeout> | null = null

async function loadSessions() {
  loading.value = true
  sessions.value = await fetchSessions(filters.value)
  loading.value = false
}

/** Smoothly refresh the session list without showing the skeleton loader. */
async function refreshSessions() {
  sessions.value = await fetchSessions(filters.value)
}

function startNewSession() {
  form.value = { ...EMPTY_SESSION_FORM }
  isPanelOpen.value = true
}

function selectSession(session: Session) {
  // Only highlight the row — don't open the edit form
  selectedSessionId.value = session.id
}

async function handleSave() {
  await saveSession(form.value)
  isPanelOpen.value = false
  await refreshSessions()
}

function handleCancel() {
  isPanelOpen.value = false
}

function handleAddStudent() {
  const name = window.prompt('Student name')
  if (!name) return
  form.value = {
    ...form.value,
    interestedStudents: [...form.value.interestedStudents, { id: `st${Date.now()}`, name }],
  }
}

onMounted(async () => {
  meta.value = await fetchPageMeta()
  filterOptions.value = await fetchFilterOptions()
  await loadSessions()
})

// Debounced filter: update smoothly without skeleton flash
watch(filters, () => {
  if (filterTimer) clearTimeout(filterTimer)
  filterTimer = setTimeout(refreshSessions, 300)
})

onUnmounted(() => {
  if (filterTimer) clearTimeout(filterTimer)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="mx-auto max-w-7xl space-y-4">
      <PageHeader v-if="meta" :meta="meta" />

      <SessionFilters v-model="filters" :options="filterOptions" @new="startNewSession" />

      <SessionsSkeleton v-if="loading" />

      <div v-else class="grid grid-cols-1 gap-4" :class="isPanelOpen ? 'lg:grid-cols-[1fr_420px]' : ''">
        <SessionTable :sessions="sessions" :selected-id="selectedSessionId" @select="selectSession" />

        <NewSessionPanel
          v-if="isPanelOpen"
          v-model="form"
          @save="handleSave"
          @cancel="handleCancel"
          @add-student="handleAddStudent"
        />
      </div>
    </div>
  </div>
</template>