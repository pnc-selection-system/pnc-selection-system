<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import PartnerList from '../components/PartnerList.vue'
import PartnerDetailHeader from '../components/PartnerDetailHeader.vue'
import ContactPersonList from '../components/ContactPersonList.vue'
import CommunicationLog from '../components/CommunicationLog.vue'
import AddPartnerModel from '../components/AddPartnerModel.vue'
import AddContactModel from '../components/AddContactModel.vue'
import AddLogEntryModel from '../components/AddLogEntryModel.vue'
import { getErrorMessage, isAxiosError } from '@/utils/error'
import {
  fetchPartners,
  addPartner,
  addContactPerson,
  fetchContactPersons,
  addLogEntry,
  fetchCommunicationLog,
} from '../service/service'
import type { NgoPartner, NgoPartnerFormData, ContactPerson, ContactPersonFormData } from '../types/partner'
import type { CommunicationLogEntry } from '../types/communication'

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

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    partners.value = await fetchPartners()

    // Auto-select the first partner if available.
    // The watch on selectedPartner will handle loading contacts and logs.
    const firstPartner = partners.value[0]
    if (firstPartner) {
      selectedPartner.value = firstPartner
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load partners'
  } finally {
    loading.value = false
  }
})

// Watch for partner selection changes to load their contacts/logs
watch(selectedPartner, async (partner) => {
  if (partner) {
    contacts.value = []
    logEntries.value = []
    try {
      await Promise.all([
        loadContactPersons(partner.id),
        loadLogEntries(partner.id),
      ])
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load partner details'
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

async function handleAddPartner(formData: NgoPartnerFormData) {
  try {
    partnerError.value = null
    const created = await addPartner(formData)
    partners.value = [...partners.value, created]
    showAddPartner.value = false
  } catch (err) {
    partnerError.value = extractApiError(err, 'Failed to add partner')
  }
}

async function handleAddContact(formData: ContactPersonFormData) {
  if (!selectedPartner.value) return
  try {
    contactError.value = null
    const created = await addContactPerson(selectedPartner.value.id, formData)
    contacts.value = [...contacts.value, created]
    showAddContact.value = false
    contactError.value = null
  } catch (err) {
    contactError.value = extractApiError(err, 'Failed to add contact')
  }
}

async function handleAddLog(entry: Omit<CommunicationLogEntry, 'id'>) {
  if (!selectedPartner.value) return
  const created = await addLogEntry(selectedPartner.value.id, entry)
  logEntries.value = [created, ...logEntries.value]
  showAddLog.value = false
}

async function loadContactPersons(partnerId: number) {
  try {
    contacts.value = await fetchContactPersons(partnerId)
  } catch {
    contacts.value = []
  }
}

async function loadLogEntries(partnerId: number) {
  try {
    logEntries.value = await fetchCommunicationLog(partnerId)
  } catch {
    logEntries.value = []
  }
}
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <PageHeader
        breadcrumb="Outreach"
        title="NGOs & Partners"
        subtitle="Manage your partner organizations and their contact information"
      />

      <!-- Error alert -->
      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
      >
        {{ error }}
        <button class="ml-2 underline hover:no-underline" @click="error = null">Dismiss</button>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <LoadingSpinner v-if="loading" class="py-16" />
          <PartnerList
            v-else
            :partners="partners"
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
        :api-error="partnerError"
        @update:open="showAddPartner = $event; partnerError = null"
        @submit="handleAddPartner"
      />
      <AddContactModel
        v-if="selectedPartner"
        :open="showAddContact"
        :api-error="contactError"
        @update:open="showAddContact = $event; contactError = null"
        @submit="handleAddContact"
      />
      <AddLogEntryModel
        v-if="selectedPartner"
        :open="showAddLog"
        @update:open="showAddLog = $event"
        @submit="handleAddLog"
      />
    </div>
  </div>
</template>
