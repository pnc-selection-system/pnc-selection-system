<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSubject } from '../service/examSubjectService'
import type { ExamSubjectApiData } from '../types'
import type { Subject } from '../service/useSubjects'
import PageHeader from '@/components/ui/PageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const subject = ref<Subject | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (!id) throw new Error('Invalid subject ID')
    
    const apiData = await getSubject(id)
    
    // Convert API data to Subject format
    subject.value = {
      id: apiData.id,
      name: apiData.name,
      maxScore: apiData.max_score,
      weight: apiData.weight,
      rules: apiData.rules?.map(r => ({
        id: r.id,
        name: r.name,
        desc: r.desc,
        sign: r.sign as '+' | '-' | '*' | '%',
        value: Number(r.value),
        status: r.status as 'active' | 'inactive',
      })) || [],
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to load subject'
  } finally {
    loading.value = false
  }
})

const signLabels: Record<string, string> = {
  '+': 'Add',
  '-': 'Subtract',
  '*': 'Multiply',
  '%': 'Percentage',
}
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <PageHeader
          breadcrumb="EXAMS / SUBJECT"
          :title="subject ? subject.name : 'Subject Detail'"
          class="!mb-0"
        />
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-3 !py-1.5 gap-1 text-xs font-semibold"
          @click="router.back()"
        >
          ← Back
        </BaseButton>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded border border-red-200 bg-red-50 p-12 text-center text-sm text-red-600">
        {{ error }}
      </div>

      <!-- Not found -->
      <div v-else-if="!subject" class="rounded border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
        Subject not found.
      </div>

      <!-- Detail content -->
      <div v-else class="space-y-5">
        <!-- Overview card -->
        <div class="rounded border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Overview</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <!-- Subject Name -->
            <div class="p-5">
              <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Subject Name</p>
              <p class="mt-1.5 text-sm font-semibold text-slate-800">{{ subject.name }}</p>
            </div>
            <!-- Max Score -->
            <div class="p-5">
              <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Max Score</p>
              <p class="mt-1.5 text-lg font-bold text-slate-800 tabular-nums">{{ subject.maxScore }}</p>
            </div>
            <!-- Weight -->
            <div class="p-5">
              <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Weight</p>
              <p class="mt-1.5 text-lg font-bold text-blue-600 tabular-nums">{{ subject.weight }}%</p>
            </div>
          </div>
        </div>

        <!-- Rules card -->
        <div class="rounded border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Deduction Rules</h3>
              <p class="mt-0.5 text-xs text-slate-400">
                {{ subject.rules?.length || 0 }} rule{{ subject.rules?.length !== 1 ? 's' : '' }} configured
              </p>
            </div>
            <BaseBadge
              :type="subject.rules && subject.rules.length > 0 ? 'primary' : 'info'"
              size="small"
            >
              {{ subject.rules && subject.rules.length > 0 ? 'Active' : 'No Rules' }}
            </BaseBadge>
          </div>

          <!-- No rules -->
          <div
            v-if="!subject.rules || subject.rules.length === 0"
            class="flex flex-col items-center justify-center px-6 py-10 text-center"
          >
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-600">No deduction rules</p>
            <p class="mt-0.5 text-xs text-slate-400">This subject has no deduction rules configured.</p>
          </div>

          <!-- Rules list -->
          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="rule in subject.rules"
              :key="rule.id || rule.name"
              class="px-6 py-4 transition-colors hover:bg-slate-50/50"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-800">{{ rule.name || 'Untitled Rule' }}</p>
                  <p v-if="rule.desc" class="mt-0.5 text-xs text-slate-500">{{ rule.desc }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 tabular-nums">
                    {{ signLabels[rule.sign] || rule.sign }} {{ rule.value }}
                  </span>
                  <BaseBadge
                    :type="rule.status === 'active' ? 'success' : 'info'"
                    size="small"
                  >
                    {{ rule.status }}
                  </BaseBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
