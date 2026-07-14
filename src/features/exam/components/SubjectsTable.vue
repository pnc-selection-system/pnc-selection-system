<script setup lang="ts">
import { ref } from 'vue'
import type { Subject } from '../service/useSubjects'
import { useSubjects } from '../service/useSubjects'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
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
  <div class="rounded bg-white shadow-sm ring-1 ring-slate-200/60">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">Subjects & Weights</h3>
        <p class="mt-0.5 text-xs text-slate-400">{{ subjects.length }} subject{{ subjects.length !== 1 ? 's' : '' }} configured</p>
      </div>
      <BaseButton
        @click="openAddModal"
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

    <!-- Table (using DataTableWrapper like CandidateList) -->
    <DataTableWrapper
      :data="subjects"
      :bordered="false"
      empty-text="No subjects yet"
      empty-description='Click "Add subject" to get started'
    >
      <el-table-column prop="name" label="Subject" min-width="160" />
      <el-table-column prop="maxScore" label="Max Score" width="120" />
      <el-table-column label="Weight" width="120">
        <template #default="{ row }">
          <BaseBadge type="primary" size="small">
            {{ row.weight }}%
          </BaseBadge>
        </template>
      </el-table-column>
      <el-table-column label="Deduction Rule" min-width="150">
        <template #default="{ row }">
          <span
            :class="[
              'text-sm',
              row.deductionRule === 'none' ? 'text-slate-400 italic' : 'text-slate-600',
            ]"
          >
            {{ row.deductionRule }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120">
        <template #default="{ row }">
          <div class="flex items-center justify-center gap-1.5">
            <button
              @click="openEditModal(row)"
              title="Edit subject"
              class="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
            <button
              @click="removeSubject(row.id)"
              title="Delete subject"
              class="inline-flex items-center justify-center rounded-md border border-red-200 bg-white p-1.5 text-red-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </template>
      </el-table-column>
    </DataTableWrapper>

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
