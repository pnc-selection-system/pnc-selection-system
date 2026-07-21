<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Subject } from '../service/useSubjects'
import { useSubjects } from '../service/useSubjects'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import FormAction from '@/components/ui/FormAction.vue'
import SubjectFormModal from './SubjectFormModal.vue'
import SubjectDeleteModal from './SubjectDeleteModal.vue'
import SubjectsWeightFooter from './SubjectsWeightFooter.vue'

const props = defineProps<{
  campaignId?: number | null
}>()

const {
  subjects,
  totalWeight,
  isValidWeight,
  loading,
  error,
  addSubject,
  updateSubject,
  loadSubjects,
  removeSubject,
  setCampaignId,
  currentCampaignId,
} = useSubjects()

const router = useRouter()

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingSubject = ref<Subject | null>(null)
const deletingSubject = ref<Subject | null>(null)
const deleting = ref(false)
const saving = ref(false)
const deleteError = ref<string | null>(null)
const saveError = ref<string | null>(null)

watch(() => props.campaignId, (newVal) => {
  setCampaignId(newVal ?? null)
}, { immediate: true })

function openAddModal() {
  editingSubject.value = null
  showModal.value = true
}

function openEditModal(subject: Subject) {
  editingSubject.value = { ...subject }
  showModal.value = true
}

function openViewPage(subject: Subject) {
  router.push({ name: 'exam-subject-detail', params: { id: subject.id }, state: { campaignId: currentCampaignId.value } })
}

function openDeleteModal(subject: Subject) {
  deletingSubject.value = { ...subject }
  deleteError.value = null
  showDeleteModal.value = true
}

function closeModal() {
  showModal.value = false
  editingSubject.value = null
}

async function confirmDelete() {
  if (!deletingSubject.value) return
  deleting.value = true
  deleteError.value = null
  try {
    await removeSubject(deletingSubject.value.id)
    showDeleteModal.value = false
    deletingSubject.value = null
    deleteError.value = null
  } catch (err: any) {
    deleteError.value = err?.message || 'Failed to delete subject'
  } finally {
    deleting.value = false
  }
}

async function handleModalSave(data: { name: string; maxScore: number; weight: number; rules?: any[] }) {
  saving.value = true
  saveError.value = null
  try {
    if (editingSubject.value) {
      await updateSubject({
        id: editingSubject.value.id,
        ...data,
      })
    } else {
      await addSubject(data)
    }
    await loadSubjects()
    closeModal()
  } catch (err: any) {
    saveError.value = err?.message || 'An unexpected error occurred'
  } finally {
    saving.value = false
  }
}

function getWeightBadgeType(weight: number): 'success' | 'warning' | 'info' | 'primary' | 'danger' {
  if (weight <= 0) return 'info'
  if (weight < 10) return 'warning'
  if (weight <= 35) return 'primary'
  return 'success'
}
</script>

<template>
  <div class="rounded bg-white ring-1 ring-slate-200/60">
    <div class="flex items-center justify-between border border-slate-100 px-6 py-4">
      <div class="flex items-center gap-2">
        <div>
          <h3 class="text-sm font-semibold text-slate-800">
            Subjects &amp; Weights
          </h3>
          <p class="mt-0.5 text-xs text-slate-400">
            <template v-if="!currentCampaignId">
              Select a campaign to manage subjects
            </template>
            <template v-else>
              {{ subjects.length }} subject{{ subjects.length !== 1 ? 's' : '' }} configured
            </template>
          </p>
        </div>
      </div>
      <BaseButton
        v-if="currentCampaignId"
        variant="primary"
        @click="openAddModal"
      >
        <span class="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add subject
        </span>
      </BaseButton>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="error"
        class="mx-6 mt-4 flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
        <BaseButton
          variant="outline"
          size="small"
          class="ml-auto !border-0 !bg-transparent !px-1.5 !py-1.5 !text-red-500 hover:!text-red-700"
          @click="loadSubjects"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </BaseButton>
      </div>
    </Transition>

    <DataTableWrapper
      v-if="currentCampaignId"
      :data="subjects"
      :loading="loading"
      :bordered="false"
      empty-text="No subjects yet"
      empty-description='Click "Add subject" to get started'
    >
      <el-table-column label="Subject" min-width="180">
        <template #default="{ row }">
          <span class="text-xs text-slate-800">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Max Score" width="120" align="center">
        <template #default="{ row }">
          <span class="text-xs text-slate-700 tabular-nums">{{ row.maxScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Weight" width="130" align="center">
        <template #default="{ row }">
          <BaseBadge
            :type="getWeightBadgeType(row.weight)"
            size="small"
          >
            {{ row.weight }}%
          </BaseBadge>
        </template>
      </el-table-column>
      <el-table-column label="Deduction Rules" width="150" align="center">
        <template #default="{ row }">
          <span v-if="row.rules && row.rules.length > 0" class="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/60 tabular-nums">
            {{ row.rules.length }} rule{{ row.rules.length !== 1 ? 's' : '' }}
          </span>
          <span v-else class="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200/60">
            None
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="170" fixed="right">
        <template #default="{ row }">
          <FormAction
            show-view
            show-edit
            show-delete
            @view="openViewPage(row)"
            @edit="openEditModal(row)"
            @delete="openDeleteModal(row)"
          />
        </template>
      </el-table-column>
    </DataTableWrapper>

    <SubjectsWeightFooter
      v-if="currentCampaignId"
      :total-weight="totalWeight"
      :is-valid-weight="isValidWeight"
    />
  </div>

  <SubjectFormModal
    :visible="showModal"
    :subject="editingSubject"
    :subjects="subjects"
    :saving="saving"
    :server-error="saveError"
    @close="closeModal"
    @save="handleModalSave"
  />

  <SubjectDeleteModal
    v-model="showDeleteModal"
    :subject="deletingSubject"
    :deleting="deleting"
    :error="deleteError"
    @confirm="confirmDelete"
  />
</template>

<style scoped>
:deep(.el-table__body tr) {
  transition: all 0.15s ease;
}
:deep(.el-table__body tr:hover) {
  background-color: #f0f7ff !important;
}

</style>
