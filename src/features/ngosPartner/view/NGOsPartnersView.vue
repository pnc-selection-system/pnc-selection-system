<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PartnerList from '../components/PartnerList.vue'
import PartnerDetailHeader from '../components/PartnerDetailHeader.vue'
import ContactPersonList from '../components/ContactPersonList.vue'
import CommunicationLog from '../components/CommunicationLog.vue'
import AddPartnerModel from '../components/AddPartnerModel.vue'
import AddContactModel from '../components/AddContactModel.vue'
import AddLogEntryModel from '../components/AddLogEntryModel.vue'
import { fetchPartners, addPartner, addContact, addLogEntry, fetchCommunicationLog } from '../service/service'
import type { Partner } from '../types/partner'
import type { CommunicationLogEntry } from '../types/communication'

const partners = ref<Partner[]>([])
const selectedPartner = ref<Partner | null>(null)
const showAddPartner = ref(false)
const showAddContact = ref(false)
const showAddLog = ref(false)
const logEntries = ref<CommunicationLogEntry[]>([])

onMounted(async () => {
  partners.value = await fetchPartners()

  // Auto-select the first partner if available
  const firstPartner = partners.value[0]
  if (firstPartner) {
    selectedPartner.value = firstPartner
    await loadLogEntries(firstPartner.id)
  }
})

function handleSelectPartner(partner: Partner) {
  selectedPartner.value = partner
  loadLogEntries(partner.id)
}

async function handleAddPartner(organisation: string) {
  try {
    const created = await addPartner(organisation)
    partners.value = [...partners.value, created]
    showAddPartner.value = false
  } catch (err) {
    // Error will be handled by the modal component
    throw err
  }
}

async function handleAddContact(contact: Omit<Partner['contacts'][0], 'id'>) {
  if (!selectedPartner.value) return
  const created = await addContact(selectedPartner.value.id, contact)
  selectedPartner.value = {
    ...selectedPartner.value,
    contacts: [...selectedPartner.value.contacts, created],
  }
  showAddContact.value = false
}

async function handleAddLog(entry: Omit<CommunicationLogEntry, 'id'>) {
  if (!selectedPartner.value) return
  const created = await addLogEntry(selectedPartner.value.id, entry)
  logEntries.value = [created, ...logEntries.value]
  showAddLog.value = false
}

async function loadLogEntries(partnerId: string) {
  logEntries.value = await fetchCommunicationLog(partnerId)
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
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.6fr]">
        <PartnerList
          :partners="partners"
          :selected-id="selectedPartner?.id ?? null"
          @select="handleSelectPartner"
          @add="showAddPartner = true"
        />

        <div v-if="selectedPartner" class="rounded border border-slate-200 bg-white">
          <PartnerDetailHeader :partner="selectedPartner" />

          <ContactPersonList
            :contacts="selectedPartner.contacts"
            @addContact="showAddContact = true"
          />

          <CommunicationLog
            :entries="logEntries"
            @logEntry="showAddLog = true"
          />
        </div>

        <div v-else class="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <p class="text-slate-500">Select a partner to view details</p>
        </div>
      </div>

      <AddPartnerModel :open="showAddPartner" @update:open="showAddPartner = $event" @submit="handleAddPartner" />
      <AddContactModel
        v-if="selectedPartner"
        :open="showAddContact"
        @update:open="showAddContact = $event"
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
