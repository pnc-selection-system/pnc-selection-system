<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserTable from '../api/components/UserTable.vue'
import UserDialog from '../api/components/UserDialog.vue'
import { useUsers } from '../api/composables/useUsers'
import { useRoles } from '../api/composables/useRoles'
import type { User, UserCreatePayload, UserUpdatePayload } from '../types/user'

const { users, loading, searchTerm, load, create, update, remove } = useUsers()
const { roles, load: loadRoles, nameFor } = useRoles()

const dialogOpen = ref(false)
const editingUser = ref<User | null>(null)
const submitting = ref(false)

onMounted(async () => {
  await Promise.all([load(), loadRoles()])
})

function openCreate() {
  editingUser.value = null
  dialogOpen.value = true
}

function openEdit(user: User) {
  editingUser.value = user
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

async function handleSearch() {
  await load(searchTerm.value)
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-sm text-gray-500 uppercase tracking-wide">Setup / Users & Roles</p>
        <h1 class="text-3xl font-bold text-gray-900 mt-1">Users</h1>
      </div>
      <div class="flex gap-3">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search users…"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <button type="button" @click="openCreate" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
          + New User
        </button>
      </div>
    </div>

    <UserTable
      :users="users"
      :loading="loading"
      :role-name-for="nameFor"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <UserDialog
      v-model="dialogOpen"
      :user="editingUser"
      :roles="roles"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>
