import api from '@/plugins/axios'
import type { ApiResponse, ContactPerson, ContactPersonFormData, NgoPartner, NgoPartnerFormData } from '../types/partner'
import type { CommunicationLogEntry } from '../types/communication'

// --- Mock data for communication log (no backend endpoint yet) ---

const logsByPartner: Record<string, CommunicationLogEntry[]> = {
  1: [
    { id: 'l1', date: '2026-03-14', channel: 'Email', summary: 'Shared shortlist of 12 candidates' },
    { id: 'l2', date: '2026-03-03', channel: 'Call', summary: 'Confirmed session attendance' },
  ],
}

export async function fetchCommunicationLog(partnerId: number): Promise<CommunicationLogEntry[]> {
  return Promise.resolve(logsByPartner[partnerId] ?? [])
}

export async function addLogEntry(
  partnerId: number,
  entry: Omit<CommunicationLogEntry, 'id'>,
): Promise<CommunicationLogEntry> {
  const created: CommunicationLogEntry = { ...entry, id: `l${Date.now()}` }
  logsByPartner[partnerId] = [created, ...(logsByPartner[partnerId] ?? [])]
  return Promise.resolve(created)
}

// --- Real API calls for NGO partners ---

export async function fetchPartners(): Promise<NgoPartner[]> {
  const response = await api.get<ApiResponse<NgoPartner[]>>('/ngo-partners')
  return response.data.data
}

export async function addPartner(formData: NgoPartnerFormData): Promise<NgoPartner> {
  const response = await api.post<ApiResponse<NgoPartner>>('/ngo-partners', formData)
  return response.data.data
}

export async function updatePartner(id: number, formData: Partial<NgoPartnerFormData>): Promise<NgoPartner> {
  const response = await api.put<ApiResponse<NgoPartner>>(`/ngo-partners/${id}`, formData)
  return response.data.data
}

export async function deletePartner(id: number): Promise<void> {
  await api.delete(`/ngo-partners/${id}`)
}

// --- Real API calls for contact persons (nested sub-resource) ---

export async function fetchContactPersons(partnerId: number): Promise<ContactPerson[]> {
  const response = await api.get<ApiResponse<ContactPerson[]>>(`/ngo-partners/${partnerId}/contact-persons`)
  return response.data.data
}

export async function addContactPerson(partnerId: number, formData: ContactPersonFormData): Promise<ContactPerson> {
  const response = await api.post<ApiResponse<ContactPerson>>(`/ngo-partners/${partnerId}/contact-persons`, formData)
  return response.data.data
}

export async function updateContactPerson(partnerId: number, contactId: number, formData: Partial<ContactPersonFormData>): Promise<ContactPerson> {
  const response = await api.put<ApiResponse<ContactPerson>>(`/ngo-partners/${partnerId}/contact-persons/${contactId}`, formData)
  return response.data.data
}

export async function deleteContactPerson(partnerId: number, contactId: number): Promise<void> {
  await api.delete(`/ngo-partners/${partnerId}/contact-persons/${contactId}`)
}

// --- Candidates linked to an NGO partner ---

export async function fetchPartnerCandidates(partnerId: number): Promise<unknown[]> {
  const response = await api.get<ApiResponse<unknown[]>>(`/ngo-partners/${partnerId}/candidates`)
  return response.data.data
}