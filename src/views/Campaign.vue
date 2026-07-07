<script setup lang="ts">
import { ref, computed } from 'vue'

// --- Types ---
interface Campaign {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'closed'
}

// --- State ---
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

const showModal = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const statusFilter = ref<string>('all')

const emptyForm: Campaign = {
  id: '',
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'draft',
}

const form = ref<Campaign>({ ...emptyForm })
const confirmDelete = ref<Campaign | null>(null)

// --- Computed ---
const statusBadges: Record<Campaign['status'], { bg: string; text: string; dot: string }> = {
  active: { bg: '#EFF6FF', text: '#2563EB', dot: '#2563EB' },
  closed: { bg: '#ECFDF5', text: '#059669', dot: '#059669' },
  draft: { bg: '#F3F4F6', text: '#6B7280', dot: '#6B7280' },
}

const statusLabels: Record<Campaign['status'], string> = {
  active: 'Active',
  closed: 'Closed',
  draft: 'Draft',
}

const formatDateShort = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const showInfoBox = ref(true)

const filteredCampaigns = computed(() => {
  return campaigns.value.filter((c) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    const matchesStatus = statusFilter.value === 'all' || c.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// --- Methods ---
function openCreateModal() {
  isEditing.value = false
  form.value = { ...emptyForm, id: crypto.randomUUID() }
  showModal.value = true
}

function openEditModal(campaign: Campaign) {
  isEditing.value = true
  form.value = { ...campaign }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  form.value = { ...emptyForm }
}

function saveCampaign() {
  if (!form.value.name.trim() || !form.value.startDate || !form.value.endDate) return

  if (isEditing.value) {
    const idx = campaigns.value.findIndex((c) => c.id === form.value.id)
    if (idx !== -1) {
      campaigns.value[idx] = { ...form.value }
    }
  } else {
    campaigns.value.unshift({ ...form.value })
  }
  closeModal()
}

function deleteCampaign(id: string) {
  campaigns.value = campaigns.value.filter((c) => c.id !== id)
  confirmDelete.value = null
}

function getStatusCount(status: Campaign['status'] | 'all') {
  if (status === 'all') return campaigns.value.length
  return campaigns.value.filter((c) => c.status === status).length
}

function dismissInfoBox() {
  showInfoBox.value = false
}

function handleModalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeModal()
  }
}

function handleDeleteKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    confirmDelete.value = null
  }
}
</script>

<template>
  <div class="min-h-screen" style="background-color: #f5f6fa">
    <div style="max-width: 1200px; margin: 0 auto; padding: 32px 24px">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px">
        <h1 style="font-size: 30px; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.025em">
          Campaign
        </h1>
        <button
          @click="openCreateModal"
          class="campaign-btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Campaign
        </button>
      </div>

      <!-- Info Box -->
      <div
        v-if="showInfoBox"
        style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          background-color: #fff8e5;
          border: 1px solid #fbbf24;
          border-radius: 8px;
        "
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0; margin-top: 1px">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
          <path d="M12 8V13" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1" fill="white"/>
        </svg>
        <div style="flex: 1; min-width: 0">
          <p style="margin: 0; font-size: 14px; font-weight: 500; color: #92400e; line-height: 1.5">
            This page shows all available election campaigns. You can create, edit, or delete campaigns as needed.
          </p>
        </div>
        <button
          @click="dismissInfoBox"
          style="
            flex-shrink: 0;
            background: none;
            border: none;
            cursor: pointer;
            padding: 2px;
            color: #92400e;
            opacity: 0.6;
          "
          title="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search & Filters -->
      <div
        style="
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px 20px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        "
      >
        <div style="position: relative; flex: 1; max-width: 320px">
          <svg
            style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none;"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search campaign..."
            class="filter-input"
          />
        </div>

        <select
          v-model="statusFilter"
          class="filter-select"
        >
          <option value="all">All Campaign</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>

        <div style="margin-left: auto; font-size: 14px; color: #6b7280">
          <span style="font-weight: 600; color: #111827">{{ filteredCampaigns.length }}</span> campaign{{ filteredCampaigns.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Table -->
      <div
        style="
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        "
      >
        <table style="width: 100%; border-collapse: collapse">
          <thead>
            <tr style="border-bottom: 1px solid #e5e7eb; background-color: #f9fafb">
              <th style="padding: 14px 20px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em">Campaign Name</th>
              <th style="padding: 14px 20px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em">Start Date</th>
              <th style="padding: 14px 20px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em">End Date</th>
              <th style="padding: 14px 20px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em">Status</th>
              <th style="padding: 14px 20px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; width: 120px">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="filteredCampaigns.length === 0"
              style="border-bottom: 1px solid #f3f4f6"
            >
              <td colspan="5" style="padding: 48px 20px; text-align: center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 12px; color: #d1d5db">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p style="margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #374151">No campaign found</p>
                <p style="margin: 0; font-size: 13px; color: #9ca3af">Try adjusting your search or filter criteria</p>
              </td>
            </tr>
            <tr
              v-for="campaign in filteredCampaigns"
              :key="campaign.id"
              class="campaign-table-row"
              style="border-bottom: 1px solid #f3f4f6; transition: background-color 0.15s"
            >
              <td style="padding: 16px 20px">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827">{{ campaign.name }}</p>
                <p style="margin: 2px 0 0; font-size: 13px; color: #6b7280; max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ campaign.description }}</p>
              </td>
              <td style="padding: 16px 20px; font-size: 14px; color: #374151">{{ formatDateShort(campaign.startDate) }}</td>
              <td style="padding: 16px 20px; font-size: 14px; color: #374151">{{ formatDateShort(campaign.endDate) }}</td>
              <td style="padding: 16px 20px">
                <span
                  :style="{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: statusBadges[campaign.status].bg,
                    color: statusBadges[campaign.status].text,
                  }"
                >
                  <span
                    :style="{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: statusBadges[campaign.status].dot,
                      flexShrink: 0,
                    }"
                  ></span>
                  {{ statusLabels[campaign.status] }}
                </span>
              </td>
              <td style="padding: 16px 20px; text-align: center">
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px">
                  <button
                    @click="openEditModal(campaign)"
                    class="campaign-action-btn campaign-edit-btn"
                    title="Edit campaign"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="confirmDelete = campaign"
                    class="campaign-action-btn campaign-delete-btn"
                    title="Delete campaign"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="showModal"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      @keydown="handleModalKeydown"
    >
      <div class="modal-backdrop" @click="closeModal" aria-hidden="true"></div>        <div class="modal-container" tabindex="-1" role="document">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0">
          <h2 id="modal-title" style="margin: 0; font-size: 18px; font-weight: 700; color: #111827">
            {{ isEditing ? 'Edit Campaign' : 'New Campaign' }}
          </h2>
          <button
            @click="closeModal"
            style="background: none; border: none; cursor: pointer; padding: 4px; color: #9ca3af; border-radius: 4px;"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCampaign" style="padding: 20px 24px 24px">
          <div style="display: grid; gap: 20px">
            <div>
              <label for="name" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                Campaign Name <span style="color: #ef4444">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="form-input"
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <label for="description" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="form-input"
                placeholder="Enter campaign description"
                style="resize: vertical; min-height: 80px"
              ></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
              <div>
                <label for="startDate" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                  Start Date <span style="color: #ef4444">*</span>
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="date"
                  required
                  class="form-input"
                />
              </div>
              <div>
                <label for="endDate" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                  End Date <span style="color: #ef4444">*</span>
                </label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div>
              <label for="status" style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px">
                Status
              </label>
              <select
                id="status"
                v-model="form.status"
                class="form-input"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb">
            <button
              type="button"
              @click="closeModal"
              class="campaign-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="campaign-btn-primary"
            >
              {{ isEditing ? 'Save Changes' : 'Create Campaign' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="confirmDelete"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      @keydown="handleDeleteKeydown"
    >
      <div class="modal-backdrop" @click="confirmDelete = null" aria-hidden="true"></div>
      <div class="modal-container" style="max-width: 440px" tabindex="-1" role="document">
        <div style="padding: 28px 24px 24px; text-align: center">
          <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; margin: 0 auto 16px; border-radius: 50%; background-color: #fef2f2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 id="delete-modal-title" style="margin: 0 0 8px; font-size: 17px; font-weight: 700; color: #111827">Delete Campaign</h3>
          <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280; line-height: 1.5">
            Are you sure you want to delete the campaign
            <strong style="color: #111827">"{{ confirmDelete.name }}"</strong>?
            This action cannot be undone.
          </p>

          <div style="display: flex; align-items: center; justify-content: center; gap: 12px">
            <button
              @click="confirmDelete = null"
              class="campaign-btn-secondary"
            >
              Cancel
            </button>
            <button
              @click="deleteCampaign(confirmDelete.id)"
              class="campaign-btn-danger"
              autofocus
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- Buttons --- */
.campaign-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: #2f6fed;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s;
  text-decoration: none;
}

.campaign-btn-primary:hover {
  background-color: #1a56d5;
}

.campaign-btn-primary:focus-visible {
  outline: 2px solid #2f6fed;
  outline-offset: 2px;
}

.campaign-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.campaign-btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.campaign-btn-secondary:focus-visible {
  outline: 2px solid #2f6fed;
  outline-offset: 2px;
}

.campaign-btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background-color: #dc2626;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s;
}

.campaign-btn-danger:hover {
  background-color: #b91c1c;
}

.campaign-btn-danger:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

/* --- Table --- */
.campaign-table-row:hover {
  background-color: #f9fafb;
}

.campaign-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  background: transparent;
}

.campaign-edit-btn {
  color: #6b7280;
}

.campaign-edit-btn:hover {
  color: #2f6fed;
  background-color: #eff4ff;
}

.campaign-delete-btn {
  color: #6b7280;
}

.campaign-delete-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

/* --- Filter Input & Select --- */
.filter-input {
  width: 100%;
  padding: 9px 12px 9px 38px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.filter-input:focus {
  border-color: #2f6fed;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1);
}

.filter-input::placeholder {
  color: #9ca3af;
}

.filter-select {
  padding: 9px 32px 9px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center;
  cursor: pointer;
  outline: none;
  appearance: none;
  min-width: 140px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.filter-select:focus {
  border-color: #2f6fed;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1);
}

/* --- Modal --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* --- Form Inputs --- */
.form-input {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  border-color: #2f6fed;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

textarea.form-input {
  font-family: inherit;
}
</style>
