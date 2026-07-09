<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { CandidateStatus } from '../types/index'
import { statusConfigs } from '../types/index'
import { useCandidateProfile } from '../service/service'
import ProfileSidebar from '../components/ProfileSidebar.vue'
import PersonalTab from '../components/PersonalTab.vue'
import EducationTab from '../components/EducationTab.vue'
import SocioeconomicTab from '../components/SocioeconomicTab.vue'
import StatusHistoryTab from '../components/StatusHistoryTab.vue'
import ExamEvaluationTab from '../components/ExamEvaluationTab.vue'

const route = useRoute()
const { getCandidateById, updateCandidateStatus, updateCandidatePhoto } = useCandidateProfile()

const activeTab = ref('personal')

const tabs = [
  { key: 'personal', label: 'Personal' },
  { key: 'education', label: 'Education' },
  { key: 'socioeconomic', label: 'Socioeconomic' },
  { key: 'status-history', label: 'Status history' },
  { key: 'exam-evaluation', label: 'Exam & evaluation' },
]

const candidateId = computed(() => route.params.id as string)
const candidate = computed(() => getCandidateById(candidateId.value))

function handleStatusUpdate(status: CandidateStatus) {
  if (candidate.value) {
    updateCandidateStatus(candidate.value.id, status)
  }
}

function handlePhotoUpdate(photoUrl: string) {
  if (candidate.value) {
    updateCandidatePhoto(candidate.value.id, photoUrl)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 px-4 py-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1200px] py-4">
      <!-- Breadcrumb & Header -->
      <div class="mb-3">
        <div class="flex flex-col gap-0">
          <p class="text-[10px] font-semibold uppercase text-slate-500">CANDIDATES / PROFILE</p>
          <h1 class="text-[22px] font-semibold tracking-tight text-slate-900">
            {{ candidate?.fullName }}
            <span class="ml-2 text-base font-normal text-slate-400">· {{ candidate?.candidateCode }}</span>
          </h1>
        </div>
      </div>

      <!-- Info Banner -->
      <div
        v-if="candidate"
        class="mb-5 flex flex-wrap items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 px-5 py-2.5"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase text-amber-600">ROLES</span>
          <span class="text-sm text-slate-700">{{ candidate.roles.join(' · ') }}</span>
          <span class="text-xs text-slate-400">(scoped read for others)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase text-amber-600">REQS</span>
          <div class="flex gap-1">
            <span
              v-for="req in candidate.requirements"
              :key="req"
              class="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600"
            >
              {{ req }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="candidate" class="flex justify-center gap-6">
        <!-- Sidebar -->
        <ProfileSidebar :candidate="candidate" @update-status="handleStatusUpdate" @update-photo="handlePhotoUpdate" />

        <!-- Right Content - Tabs -->
        <div class="flex-1 rounded-lg border border-slate-200 bg-white">
          <!-- Tab Navigation -->
          <div class="border-b border-slate-200">
            <nav class="flex px-6">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                :class="[
                  'relative px-4 py-3.5 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700',
                ]"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <div
                  v-if="activeTab === tab.key"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <PersonalTab v-if="activeTab === 'personal'" :candidate="candidate" />
            <EducationTab v-if="activeTab === 'education'" :candidate="candidate" />
            <SocioeconomicTab v-if="activeTab === 'socioeconomic'" :candidate="candidate" />
            <StatusHistoryTab v-if="activeTab === 'status-history'" :candidate="candidate" />
            <ExamEvaluationTab v-if="activeTab === 'exam-evaluation'" :candidate="candidate" />
          </div>
        </div>
      </div>

      <!-- Candidate Not Found -->
      <div v-else class="rounded-lg border border-slate-200 bg-white p-12 text-center">
        <p class="text-sm text-slate-500">Candidate not found.</p>
      </div>
    </div>
  </div>
</template>
