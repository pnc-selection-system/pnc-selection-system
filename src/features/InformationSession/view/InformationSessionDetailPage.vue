<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import { useInfoSessions } from '../composables/useInfoSessions'
import { formatDateShort } from '@/utils/date'
import type { Session } from '../types/session'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const route = useRoute()
const router = useRouter()
const { getSession } = useInfoSessions()

const session = ref<Session | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    session.value = await getSession(Number(route.params.id))
    loading.value = false
  } catch {
    error.value = 'Session not found.'
    loading.value = false
  }
})
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <PageHeader
        breadcrumb="OUTREACH / INFORMATION SESSIONS / VIEW"
        :title="session ? session.school_name : 'Session Detail'"
      >
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-3 !py-1.5 gap-1 text-xs font-semibold"
          @click="router.back()"
        >
          ← Back
        </BaseButton>
      </PageHeader>

      <div v-if="loading" class="flex justify-center py-12">
        <span class="text-sm text-slate-400">Loading…</span>
      </div>

      <div v-else-if="error || !session" class="rounded border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        {{ error || 'Session not found.' }}
      </div>

      <div v-else class="rounded border border-slate-200 bg-white overflow-hidden">
        <div class="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">

          <!-- Left column -->
          <div class="space-y-5 p-6">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">School</p>
              <p class="mt-1 text-sm font-medium text-slate-900">{{ session.school_name }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Date</p>
              <p class="mt-1 text-sm text-slate-700">{{ formatDateShort(session.session_date) }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Attendance</p>
              <p class="mt-1 text-sm text-slate-700">
                {{ (session.attendance_count ?? 0).toLocaleString() }}
                <span class="text-slate-400">/ {{ session.expected_attendance.toLocaleString() }} expected</span>
              </p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Partner Type</p>
              <div class="mt-1">
                <BaseBadge v-if="session.partner_type" type="info" size="small">
                  {{ session.partner_type }}
                </BaseBadge>
                <span v-else class="text-sm text-slate-400">—</span>
              </div>
            </div>
            <div v-if="session.partner_name">
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{{ session.partner_type }} Name</p>
              <p class="mt-1 text-sm text-slate-700">{{ session.partner_name }}</p>
            </div>
          </div>

          <!-- Right column -->
          <div class="space-y-5 p-6">
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Province</p>
              <p class="mt-1 text-sm text-slate-700">{{ session.province || '—' }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">District</p>
              <p class="mt-1 text-sm text-slate-700">{{ session.district || '—' }}</p>
            </div>
            <div>
              <p class="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Venue</p>
              <p class="mt-1 text-sm text-slate-700">{{ session.venue || '—' }}</p>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>
