<script setup lang="ts">
import { ref } from 'vue'
import type { Subject } from '../service/useSubjects'
import { useSubjects } from '../service/useSubjects'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import FormAction from '@/components/ui/FormAction.vue'
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
        <h3 class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400">Subjects & Weights</h3>

      </div>
      <BaseButton
        @click="openAddModal"
        class="!w-auto !rounded !px-4 !py-2 !text-xs"
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

    <!-- Data Table -->
    <DataTableWrapper
      :data="subjects"
      :bordered="false"
      empty-text="No subjects yet"
      empty-description='Click "Add subject" to get started'
    >
      <el-table-column label="Subject" min-width="160">
        <template #default="{ row }">
          <span class="font-medium text-slate-800 text-xs">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Max Score" width="120">
        <template #default="{ row }">
          <span class="tabular-nums text-xs text-slate-600">{{ row.maxScore }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Weight" width="120">
        <template #default="{ row }">
          <BaseBadge type="primary" size="small" class="!rounded tabular-nums">
            {{ row.weight }}%
          </BaseBadge>
        </template>
      </el-table-column>

      <el-table-column label="Deduction Rule" min-width="160">
        <template #default="{ row }">
          <span
            :class="[
              'text-xs',
              row.deductionRule === 'none' ? 'text-slate-400 italic' : 'text-slate-600',
            ]"
          >
            {{ row.deductionRule }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="180" fixed="right">
        <template #default="{ row }">
          <FormAction
            :show-view="false"
            :show-delete="true"
            delete-label="Delete"
            @edit="openEditModal(row)"
            @delete="removeSubject(row.id)"
          />
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
        <BaseBadge :type="isValidWeight ? 'success' : 'warning'" size="default" class="!rounded tabular-nums">
          {{ totalWeight }}% / 100%
        </BaseBadge>
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
