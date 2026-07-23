<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import SessionFilters from '../components/SessionFilters.vue'
import SessionTable from '../components/SessionTable.vue'
import SessionFormPanel from '../components/SessionFormPanel.vue'
import { useInfoSessions } from '../composables/useInfoSessions'
import { EMPTY_SESSION_FORM, type Session, type SessionFormData } from '../types/session'
import BasePagination from '@/components/base/BasePagination.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { ElMessage } from 'element-plus'
import { useDebouncedWatch } from '@/utils/useDebouncedWatch'

const {
  sessions,
  campaigns,
  filterOptions,
  filters,
  currentPage,
  total,
  isLoading,
  bootstrap,
  setPage,
  applyFilters,
  createSession,
  updateSession,
  getActiveCampaignId,
} = useInfoSessions()

onMounted(async () => {
  try {
    await bootstrap()
  } catch (err) {
    console.error('[InformationSessionView] Error during bootstrap:', err)
  }
})

const isFormOpen = ref(false)
const isSaving = ref(false)

function emptyForm(): SessionFormData {
  return { ...EMPTY_SESSION_FORM, campaign_id: getActiveCampaignId() }
}

const form = ref<SessionFormData>(emptyForm())

function startNewSession() {
  form.value = emptyForm()
  isFormOpen.value = true
}

function handleEdit(session: Session) {
  const dateOnly = session.session_date?.split('T')[0] ?? ''
  form.value = {
    id: session.id,
    date: dateOnly,
    province_id: session.province_id ? Number(session.province_id) : null,
    district_id: session.district_id ? Number(session.district_id) : null,
    commune_id: session.commune_id ? Number(session.commune_id) : null,
    village_id: session.village_id ? Number(session.village_id) : null,
    school: session.school_name,
    venue: session.venue ?? '',
    attendanceCount: session.attendance_count ?? 0,
    expectedAttendance: session.expected_attendance,
    partnerType: (session.partner_type as 'School' | 'Alumni' | 'NGO' | 'Officer' | '') ?? '',
    partnerName: session.partner_name ?? '',
    location: session.location ?? '',
    department: session.department ?? '',
    generation: session.generation ?? '',
    hosts: (session.hosts || []).map(h => ({ name: h.host_name })),
    createdBy: [],
    createByInput: '',
    campaign_id: session.campaign_id,
  }
  isFormOpen.value = true
}

async function handleSave() {
  if (isSaving.value) return
  isSaving.value = true
  try {
    if (form.value.id) {
      await updateSession(form.value)
    } else {
      await createSession(form.value)
    }
    ElMessage.success('Session saved successfully')
    form.value = emptyForm()
    isFormOpen.value = false
  } catch (err: any) {
    // Show field-level validation errors from the backend
    const responseData = err?.response?.data
    if (responseData?.errors) {
      const fieldErrors = Object.entries(responseData.errors)
        .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
        .join('; ')
      ElMessage.error(fieldErrors || responseData.message || 'Failed to save session')
    } else {
      ElMessage.error(responseData?.message || err?.message || 'Failed to save session')
    }
  } finally {
    isSaving.value = false
  }
}

function handleCancel() {
  form.value = emptyForm()
  isFormOpen.value = false
}

function viewCandidates(_session: Session) { void _session }

const modalTitle = computed(() =>
  form.value.id ? 'Edit Information Session' : 'New Information Session'
)

useDebouncedWatch(filters, applyFilters, 300, true)
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader breadcrumb="OUTREACH / INFORMATION SESSIONS" title="Information sessions" />

      <SessionFilters v-model="filters" :options="filterOptions" @new="startNewSession" />

      <div class="flex flex-col gap-0">
        <SessionTable
          :sessions="sessions"
          :loading="isLoading"
          :selected-id="form.id"
          @select="handleEdit"
          @edit="handleEdit"
          @view-candidates="viewCandidates"
        />
        <BasePagination
          :current-page="currentPage"
          :total="total"
          :page-size="10"
          @update:current-page="setPage"
        />
      </div>

      <BaseModal
        v-model="isFormOpen"
        :title="modalTitle"
        width="640px"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <SessionFormPanel
          v-model="form"
          :options="filterOptions"
          :campaigns="campaigns"
          :is-saving="isSaving"
          @save="handleSave"
          @cancel="handleCancel"
        />
      </BaseModal>
    </div>
  </div>
</template>
