<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Candidate, CandidateStatus } from '../types/index'
import { statusConfigs } from '../types/index'

const props = defineProps<{
  candidate: Candidate
}>()

const emit = defineEmits<{
  (e: 'updateStatus', status: CandidateStatus): void
  (e: 'updatePhoto', photoUrl: string): void
}>()

const showStatusDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)

const statusConfig = computed(() => statusConfigs[props.candidate.status])

function handleStatusChange(status: CandidateStatus) {
  emit('updateStatus', status)
  showStatusDropdown.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showStatusDropdown.value = false
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handlePhotoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      photoPreview.value = url
      emit('updatePhoto', url)
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="w-[280px] flex-shrink-0 rounded-lg border border-slate-200 bg-white p-6">
    <!-- Photo -->
    <div class="mx-auto mb-4">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handlePhotoUpload"
      />
      <div
        class="group relative flex h-[180px] w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
        @click="triggerFileInput"
      >
        <img
          v-if="photoPreview || candidate.photoUrl"
          :src="photoPreview || candidate.photoUrl"
          :alt="candidate.fullName"
          class="h-full w-full object-cover"
        />
        <template v-else>
          <div class="flex flex-col items-center gap-1">
            <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-xs font-medium text-slate-400">PHOTO</span>
          </div>
        </template>
        <!-- Hover overlay -->
        <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div class="flex flex-col items-center gap-1 text-white">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="text-xs font-medium">Upload photo</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Name & Details -->
    <div class="text-center">
      <h2 class="text-lg font-semibold text-slate-900">{{ candidate.fullName }}</h2>
      <p class="mt-1 text-sm text-slate-500">
        {{ candidate.gender }} · {{ candidate.age }} · {{ candidate.province }}
      </p>
    </div>

    <!-- Divider -->
    <div class="my-4 border-t border-slate-200"></div>

    <!-- Status Badge -->
    <div class="text-center">
      <div
        class="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium"
        :style="{
          backgroundColor: statusConfig.bg,
          color: statusConfig.text,
          border: `1px solid ${statusConfig.border}`,
        }"
      >
        Status: {{ statusConfig.label }}
      </div>
      <p class="mt-2 text-sm text-slate-600">{{ candidate.organization }}</p>
    </div>

    <!-- Change Status Button -->
    <div ref="dropdownRef" class="relative mt-4">
      <button
        class="flex w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        @click="showStatusDropdown = !showStatusDropdown"
      >
        Change status
        <svg
          class="h-4 w-4 text-slate-400"
          :class="{ 'rotate-180': showStatusDropdown }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown -->
      <div
        v-if="showStatusDropdown"
        class="absolute left-0 right-0 top-full z-10 mt-1 rounded border border-slate-200 bg-white shadow-lg"
      >
        <button
          v-for="(config, status) in statusConfigs"
          :key="status"
          class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
          @click="handleStatusChange(status as CandidateStatus)"
        >
          <span
            class="inline-block h-2 w-2 rounded-full"
            :style="{ backgroundColor: config.text }"
          />
          {{ config.label }}
        </button>
      </div>
    </div>
  </div>
</template>
