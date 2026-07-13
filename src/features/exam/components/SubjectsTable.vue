<script setup lang="ts">
import { ref } from 'vue'
import type { Subject } from '../service/useSubjects'
import { useSubjects } from '../service/useSubjects'
import BaseButton from '@/components/base/BaseButton.vue'
import SubjectFormModal from './SubjectFormModal.vue'

const { subjects, totalWeight, isValidWeight, removeSubject } = useSubjects()

const showModal = ref(false)
const editingSubject = ref<Subject | null>(null)

function openAddModal() {
  editingSubject.value = null
  showModal.value = true
}

function openEditModal(subject: Subject) {
  editingSubject.value = { ...subject }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingSubject.value = null
}
</script>

<template>
  <div class="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">Subjects & Weights</h3>
        <p class="mt-0.5 text-xs text-slate-400">{{ subjects.length }} subject{{ subjects.length !== 1 ? 's' : '' }} configured</p>
      </div>
      <BaseButton
        @click="openAddModal"
        class="!w-auto !rounded-lg !px-4 !py-2 !text-xs"
        variant="primary"
      >
        <span class="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add subject
        </span>
      </BaseButton>
    </div>

    <!-- Table -->
    <div class="overflow-hidden">
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="bg-gradient-to-r from-slate-50 to-slate-100/80">
            <th class="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Subject</th>
            <th class="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Max Score</th>
            <th class="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Weight</th>
            <th class="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Deduction Rule</th>
            <th class="px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(subject, index) in subjects"
            :key="subject.id"
            :class="[
              'transition-colors duration-150',
              index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50',
              'hover:bg-blue-50/30',
            ]"
          >
            <!-- Subject Name -->
            <td class="px-6 py-4">
              <span class="font-medium text-slate-800">{{ subject.name }}</span>
            </td>

            <!-- Max Score -->
            <td class="px-6 py-4">
              <span class="tabular-nums text-slate-600">{{ subject.maxScore }}</span>
            </td>

            <!-- Weight -->
            <td class="px-6 py-4">
              <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 tabular-nums">
                {{ subject.weight }}%
              </span>
            </td>

            <!-- Deduction Rule -->
            <td class="px-6 py-4">
              <span
                :class="[
                  'text-sm',
                  subject.deductionRule === 'none' ? 'text-slate-400 italic' : 'text-slate-600',
                ]"
              >
                {{ subject.deductionRule }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="openEditModal(subject)"
                  class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  Edit
                </button>
                <button
                  @click="removeSubject(subject.id)"
                  class="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm transition hover:bg-red-100 hover:border-red-300"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="subjects.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center">
                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-slate-500">No subjects yet</p>
                <p class="mt-1 text-xs text-slate-400">Click "Add subject" to get started</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-3">
      <span class="text-xs text-slate-400">Weights must total 100%</span>
      <div class="flex items-center gap-2">
        <div
          :class="[
            'h-2 w-2 rounded-full',
            isValidWeight ? 'bg-emerald-500' : 'bg-amber-400',
          ]"
        />
        <span
          :class="[
            'rounded-full px-3 py-1 text-xs font-medium tabular-nums',
            isValidWeight
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60'
              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
          ]"
        >
          {{ totalWeight }}% / 100%
        </span>
      </div>
    </div>
  </div>

  <!-- Subject Form Modal -->
  <SubjectFormModal
    :visible="showModal"
    :subject="editingSubject"
    @close="closeModal"
    @saved="closeModal"
  />
</template>
