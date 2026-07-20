<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Candidate, CandidateStatus } from '../types/index'
import { statusConfigs } from '../types/index'
import { useCandidateProfile } from '../service/service'
import ProfileSidebar from '../components/ProfileSidebar.vue'
import PersonalTab from '../components/PersonalTab.vue'
import EducationTab from '../components/EducationTab.vue'
import SocioeconomicTab from '../components/SocioeconomicTab.vue'
import StatusHistoryTab from '../components/StatusHistoryTab.vue'
import ExamEvaluationTab from '../components/ExamEvaluationTab.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const { getCandidateById, updateCandidateStatus, updateCandidatePhoto } = useCandidateProfile()

const activeTab = ref('personal')
const candidate = ref<Candidate | null>(null)
const loading = ref(true)

const tabs = [
  { key: 'personal', label: 'Personal' },
  { key: 'education', label: 'Education' },
  { key: 'socioeconomic', label: 'Socioeconomic' },
  { key: 'status-history', label: 'Status history' },
  { key: 'exam-evaluation', label: 'Exam & evaluation' },
]

const candidateId = computed(() => route.params.id as string)

async function loadCandidate() {
  loading.value = true
  candidate.value = await getCandidateById(candidateId.value)
  loading.value = false
}

watch(candidateId, () => {
  activeTab.value = 'personal'
  loadCandidate()
}, { immediate: true })

async function handleStatusUpdate(status: CandidateStatus) {
  if (candidate.value) {
    await updateCandidateStatus(candidate.value.id, status)
    candidate.value = { ...candidate.value, status }
  }
}

function handlePhotoUpdate(photoUrl: string) {
  if (candidate.value) {
    updateCandidatePhoto(candidate.value.id, photoUrl)
    candidate.value = { ...candidate.value, photoUrl }
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 px-4 py-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1200px] py-4">
      <div class="mb-3">
        <h1 class="text-2xl font-semibold text-slate-900">
          {{ candidate?.fullName ?? 'Candidate Profile' }}
        </h1>
        <p class="mt-1 text-sm text-slate-500">{{ candidate?.candidateCode }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <!-- Main Content -->
      <div v-else-if="candidate" class="flex justify-center gap-6">
        <!-- Sidebar -->
        <ProfileSidebar :candidate="candidate" @update-status="handleStatusUpdate" @update-photo="handlePhotoUpdate" />

        <!-- Right Content - Tabs -->
        <div class="flex-1 rounded border border-slate-200 bg-white">
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
      <div v-else class="flex justify-center py-20">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-slate-700">Candidate not found</h3>
          <p class="mt-1 text-sm text-slate-500">The candidate you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    </div>
  </div>
</template>
