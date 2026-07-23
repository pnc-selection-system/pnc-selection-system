<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import PartnerList from '../components/PartnerList.vue'
import PartnerDetailHeader from '../components/PartnerDetailHeader.vue'
import ContactPersonList from '../components/ContactPersonList.vue'
import CommunicationLog from '../components/CommunicationLog.vue'
import AddPartnerModel from '../components/AddPartnerModel.vue'
import AddContactModel from '../components/AddContactModel.vue'
import AddLogEntryModel from '../components/AddLogEntryModel.vue'
import { getErrorMessage, isAxiosError } from '@/utils/error'
import { getCachedPartners, getCachedContacts, getCachedLogs, prefetchNgoPartnerDetails, setCachedContacts, setCachedLogs } from '@/composables/useRoutePrefetch'
import {
  fetchPartners,
  addPartner,
  addContactPerson,
  fetchContactPersons,
  addLogEntry,
  fetchCommunicationLog,
} from '../service/service'
import { saveLogo } from '../composables/usePartnerLogos'
import type { NgoPartner, NgoPartnerFormData, ContactPerson, ContactPersonFormData } from '../types/partner'
import type { CommunicationLogEntry } from '../types/communication'

const saving = ref(false)
const contactSaving = ref(false)
const logSaving = ref(false)
const partners = ref<NgoPartner[]>([])
const selectedPartner = ref<NgoPartner | null>(null)
const contacts = ref<ContactPerson[]>([])
const showAddPartner = ref(false)
const showAddContact = ref(false)
const showAddLog = ref(false)
const logEntries = ref<CommunicationLogEntry[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const contactError = ref<string | null>(null)
const partnerError = ref<string | null>(null)

// Filter out any null items that could crash the template rendering
const validPartners = computed(() => Array.isArray(partners.value) ? partners.value.filter(Boolean) : [])

onMounted(async () => {
  try {
    error.value = null

    const cached = getCachedPartners()
    if (cached) {
      partners.value = cached
      loading.value = false
    } else {
      partners.value = await fetchPartners()
      loading.value = false
    }

    const firstPartner = partners.value[0]
    if (firstPartner) {
      selectedPartner.value = firstPartner
      const cachedContacts = getCachedContacts(firstPartner.id)
      const cachedLogs = getCachedLogs(firstPartner.id)
      if (cachedContacts) contacts.value = cachedContacts
      if (cachedLogs) logEntries.value = cachedLogs
      prefetchNgoPartnerDetails(firstPartner.id)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load partners'
    loading.value = false
  }
})

// Watch for partner selection changes — show cached data instantly, fetch in background
watch(selectedPartner, async (partner) => {
  if (partner) {
    const cachedContacts = getCachedContacts(partner.id)
    const cachedLogs = getCachedLogs(partner.id)

    if (cachedContacts) {
      contacts.value = cachedContacts
    } else {
      contacts.value = []
    }
    if (cachedLogs) {
      logEntries.value = cachedLogs
    } else {
      logEntries.value = []
    }

    if (!cachedContacts || !cachedLogs) {
      await Promise.all([
        !cachedContacts ? loadContactPersons(partner.id) : Promise.resolve(),
        !cachedLogs ? loadLogEntries(partner.id) : Promise.resolve(),
      ])
    }
  }
})

function handleSelectPartner(partner: NgoPartner) {
  selectedPartner.value = partner
}

function extractApiError(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data) {
    const data = err.response.data as Record<string, unknown>
    const message = getErrorMessage(err, fallback)
    // Laravel returns field-level errors in the "errors" key
    if (data.errors && typeof data.errors === 'object') {
      const fieldErrors = Object.entries(data.errors as Record<string, unknown>)
        .map(([field, messages]) => {
          const msgs = Array.isArray(messages) ? messages : [String(messages)]
          return `${field}: ${msgs.join(', ')}`
        })
        .join('; ')
      return `${message} — ${fieldErrors}`
    }
    return message
  }
  return getErrorMessage(err, fallback)
}

async function handleAddPartner(formData: NgoPartnerFormData, logoBase64: string | null) {
  saving.value = true
  try {
    partnerError.value = null
    const created = await addPartner(formData)
    if (logoBase64) saveLogo(created.id, logoBase64)
    partners.value = [...(Array.isArray(partners.value) ? partners.value : []), created]
    showAddPartner.value = false
  } catch (err) {
    partnerError.value = extractApiError(err, 'Failed to add partner')
  } finally {
    saving.value = false
  }
}

async function handleAddContact(formData: ContactPersonFormData) {
  if (!selectedPartner.value) return
  contactSaving.value = true
  try {
    contactError.value = null
    const created = await addContactPerson(selectedPartner.value.id, formData)
    contacts.value = [...contacts.value, created]
    setCachedContacts(selectedPartner.value.id, contacts.value)
    showAddContact.value = false
    contactError.value = null
  } catch (err) {
    contactError.value = extractApiError(err, 'Failed to add contact')
  } finally {
    contactSaving.value = false
  }
}

async function handleAddLog(entry: Omit<CommunicationLogEntry, 'id'>) {
  if (!selectedPartner.value) return
  logSaving.value = true
  try {
    const created = await addLogEntry(selectedPartner.value.id, entry)
    logEntries.value = [created, ...logEntries.value]
    setCachedLogs(selectedPartner.value.id, logEntries.value)
    showAddLog.value = false
  } catch {
    // Silently fail — log is non-critical
  } finally {
    logSaving.value = false
  }
}

async function loadContactPersons(partnerId: number) {
  try {
    const data = await fetchContactPersons(partnerId)
    setCachedContacts(partnerId, data)
    contacts.value = data
  } catch {
    contacts.value = getCachedContacts(partnerId) || []
  }
}

async function loadLogEntries(partnerId: number) {
  try {
    const data = await fetchCommunicationLog(partnerId)
    setCachedLogs(partnerId, data)
    logEntries.value = data
  } catch {
    logEntries.value = getCachedLogs(partnerId) || []
  }
}
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader breadcrumb="OUTREACH / NGOs & PARTNERS" title="NGOs & Partners" />

      <!-- Error alert -->
      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
      >
        {{ error }}
        <button class="ml-2 underline hover:no-underline" @click="error = null">Dismiss</button>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <LoadingSpinner v-if="loading" class="py-16" />
          <PartnerList
            v-else
            :partners="validPartners"
            :selected-id="selectedPartner?.id ?? null"
            @select="handleSelectPartner"
            @add="showAddPartner = true"
          />
        </div>

        <div v-if="selectedPartner" class="rounded border border-slate-200 bg-white">
          <PartnerDetailHeader :partner="selectedPartner" />

          <ContactPersonList
            :contacts="contacts"
            @addContact="showAddContact = true"
          />

          <CommunicationLog
            :entries="logEntries"
            @logEntry="showAddLog = true"
          />
        </div>

        <div v-else class="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-12">
          <p class="text-slate-500">Select a partner to view details</p>
        </div>
      </div>

      <AddPartnerModel
        :open="showAddPartner"
        :saving="saving"
        :api-error="partnerError"
        @update:open="showAddPartner = $event; partnerError = null"
        @submit="(fd, logo) => handleAddPartner(fd, logo)"
      />
      <AddContactModel
        v-if="selectedPartner"
        :open="showAddContact"
        :saving="contactSaving"
        :api-error="contactError"
        @update:open="showAddContact = $event; contactError = null"
        @submit="handleAddContact"
      />
      <AddLogEntryModel
        v-if="selectedPartner"
        :open="showAddLog"
        :saving="logSaving"
        @update:open="showAddLog = $event"
        @submit="handleAddLog"
      />
    </div>
  </div>
</template>
