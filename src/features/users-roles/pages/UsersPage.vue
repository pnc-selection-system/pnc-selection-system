<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsers } from '../api/composables/useUsers'
import { useRoles } from '../api/composables/useRoles'
import UserDialog from '../api/components/UserDialog.vue'
import UserTable from '../api/components/UserTable.vue'
import type { User, UserCreatePayload, UserUpdatePayload } from '../types/user'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'

const { users, loading, error, searchTerm, load, create, update, remove } = useUsers()
const { roles, load: loadRoles, nameFor } = useRoles()

const dialogOpen = ref(false)
const editingUser = ref<User | null>(null)
const submitting = ref(false)
const viewOnly = ref(false)

onMounted(() => Promise.all([load(), loadRoles()]))

function openCreate() {
  editingUser.value = null
  viewOnly.value = false
  dialogOpen.value = true
}

function openEdit(user: User) {
  editingUser.value = user
  viewOnly.value = false
  dialogOpen.value = true
}

function openView(user: User) {
  editingUser.value = user
  viewOnly.value = true
  dialogOpen.value = true
}

async function handleSubmit(payload: UserCreatePayload | UserUpdatePayload) {
  submitting.value = true
  try {
    if (editingUser.value) {
      await update(editingUser.value.id, payload as UserUpdatePayload)
    } else {
      await create(payload as UserCreatePayload)
    }
    dialogOpen.value = false
  } finally {
    submitting.value = false
  }
}

async function handleDelete(user: User) {
  if (confirm(`Delete user "${user.username}"?`)) {
    await remove(user.id)
  }
}
</script>

<template>
  <div class="px-6 py-6">
    <div class="mx-auto max-w-[1200px] space-y-4">

      <PageHeader breadcrumb="SETUP / USERS & ROLES" title="Users" />

      <div v-if="loading && users.length === 0" class="flex justify-center py-12">
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
            placeholder="Search users…"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            @keyup.enter="load(searchTerm)"
          />
          <BaseButton @click="openCreate" class="!w-auto !rounded-lg !px-4 !py-2 text-sm">
            + New User
          </BaseButton>
        </div>

        <UserTable
          :users="users"
          :loading="loading"
          :role-name-for="nameFor"
          @edit="openEdit"
          @view="openView"
          @delete="handleDelete"
        />
      </template>

    </div>

    <UserDialog
      v-model="dialogOpen"
      :user="editingUser"
      :roles="roles"
      :submitting="submitting"
      :view-only="viewOnly"
      @submit="handleSubmit"
    />
  </div>
</template>
