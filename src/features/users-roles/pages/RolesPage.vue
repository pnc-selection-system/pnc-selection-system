<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoles } from '../api/composables/useRoles'
import RoleDialog from '../api/components/RoleDialog.vue'
import RoleTable from '../api/components/RoleTable.vue'
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '../types/role'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const { roles, loading, error, searchTerm, load, create, update, remove } = useRoles()

const dialogOpen = ref(false)
const editingRole = ref<Role | null>(null)
const submitting = ref(false)
const viewOnly = ref(false)

onMounted(() => load())

function openCreate() {
  editingRole.value = null
  viewOnly.value = false
  dialogOpen.value = true
}

function openEdit(role: Role) {
  editingRole.value = role
  viewOnly.value = false
  dialogOpen.value = true
}

function openView(role: Role) {
  editingRole.value = role
  viewOnly.value = true
  dialogOpen.value = true
}

async function handleSubmit(payload: RoleCreatePayload | RoleUpdatePayload) {
  submitting.value = true
  try {
    if (editingRole.value) {
      await update(editingRole.value.id, payload as RoleUpdatePayload)
    } else {
      await create(payload as RoleCreatePayload)
    }
    dialogOpen.value = false
  } finally {
    submitting.value = false
  }
}

async function handleDelete(role: Role) {
  if (role.isSystem) return
  if (confirm(`Delete role "${role.name}"?`)) {
    await remove(role.id)
  }
}
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <PageHeader breadcrumb="SETUP / USERS & ROLES" title="Roles" />

      <div v-if="loading && roles.length === 0" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else-if="error" class="mb-4">
        <ErrorAlert :message="error" />
        <div class="mt-3 flex justify-end">
          <BaseButton @click="load()" variant="secondary" class="!w-auto !rounded !px-3 !py-1 text-sm">
            Retry
          </BaseButton>
        </div>
      </div>

      <template v-else>
        <div class="flex items-center justify-between">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search roles…"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            @keyup.enter="load(searchTerm)"
          />
          <BaseButton @click="openCreate" class="!w-auto !rounded-lg !px-4 !py-2 text-sm">
            + New Role
          </BaseButton>
        </div>

        <RoleTable
          :roles="roles"
          :loading="loading"
          @edit="openEdit"
          @view="openView"
          @delete="handleDelete"
        />
      </template>

    </div>

    <RoleDialog
      v-model="dialogOpen"
      :role="editingRole"
      :submitting="submitting"
      :view-only="viewOnly"
      @submit="handleSubmit"
    />
  </div>
</template>
