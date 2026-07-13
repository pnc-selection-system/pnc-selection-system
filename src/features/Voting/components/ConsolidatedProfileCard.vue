<script setup lang="ts">
import type { ConsolidatedProfile } from '../types/candidate'

defineProps<{
  profile: ConsolidatedProfile
  reqTag?: string
}>()
</script>

<template>
  <div class="flex items-start justify-between px-6 py-5">
    <h2 class="text-lg font-bold text-slate-800">
      Consolidated profile · {{ profile.candidateName }}
    </h2>
    <span v-if="reqTag" class="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-500">
      {{ reqTag }}
    </span>
  </div>

  <div class="flex flex-wrap items-start gap-4 px-6 pb-5">
    <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
      Photo
    </div>

    <div class="flex flex-1 flex-wrap gap-2.5">
      <div class="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
        Exam <span class="font-semibold text-slate-800">{{ profile.examScore }}</span> · #{{ profile.examRank }}
      </div>
      <div class="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
        Assessment <span class="font-semibold text-slate-800">{{ profile.assessmentPercent }}%</span>
      </div>
      <div class="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
        Investigation
        <span
          class="font-semibold"
          :class="profile.investigationRecommendation === 'Recommended' ? 'text-green-700' : 'text-rose-700'"
        >
          {{ profile.investigationRecommendation }}
        </span>
      </div>
      <div class="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600">
        Need index <span class="font-semibold text-slate-800">{{ profile.needIndex }}</span>
      </div>
    </div>
  </div>
</template>