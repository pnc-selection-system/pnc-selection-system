<script setup lang="ts">
import { ref } from 'vue'
import type { Campaign } from '../types'
import { statusBadges, statusLabels, formatDateShort } from '../types'
import { useCampaigns } from '../composables/useCampaigns'
import CampaignFormModal from '../components/CampaignFormModal.vue'
import CampaignDeleteModal from '../components/CampaignDeleteModal.vue'

const {
  searchQuery,
  statusFilter,
  showInfoBox,
  filteredCampaigns,
  dismissInfoBox,
} = useCampaigns()

const showFormModal = ref(false)
const editingCampaign = ref<Campaign | null>(null)
const confirmDelete = ref<Campaign | null>(null)

function openCreateModal() {
  editingCampaign.value = null
  showFormModal.value = true
}

function openEditModal(campaign: Campaign) {
  editingCampaign.value = campaign
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingCampaign.value = null
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
    </div>

    <CampaignFormModal
      :visible="showFormModal"
      :campaign="editingCampaign"
      @close="closeFormModal"
    />

    <CampaignDeleteModal
      :campaign="confirmDelete"
      @close="confirmDelete = null"
    />
  </div>
</template>

<style scoped>
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

.campaign-table-row:hover {
  background-color: #f9fafb;
}

.campaign-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s, opacity 0.15s;
}

.campaign-edit-btn {
  color: #2563eb;
  background-color: #eff6ff;
}

.campaign-edit-btn:hover {
  background-color: #dbeafe;
}

.campaign-delete-btn {
  color: #dc2626;
  background-color: #fef2f2;
}

.campaign-delete-btn:hover {
  background-color: #fee2e2;
}

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
</style>
