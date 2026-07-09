<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RoleTable from '../api/components/RoleTable.vue'
import RoleDialog from '../api/components/RoleDialog.vue'
import { useRoles } from '../api/composables/useRoles'
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '../types/role'

const { roles, loading, searchTerm, load, create, update, remove } = useRoles()

const dialogOpen = ref(false)
const editingRole = ref<Role | null>(null)
const submitting = ref(false)

onMounted(async () => {
  await load()
})

function openCreate() {
  editingRole.value = null
  dialogOpen.value = true
}

function openEdit(role: Role) {
  editingRole.value = role
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

async function handleSearch() {
  await load(searchTerm.value)
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-sm text-gray-500 uppercase tracking-wide">Setup / Users & Roles</p>
        <h1 class="text-3xl font-bold text-gray-900 mt-1">Roles</h1>
      </div>
      <div class="flex gap-3">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search roles…"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <button type="button" @click="openCreate" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
          + New Role
        </button>
      </div>
    </div>

    <RoleTable :roles="roles" :loading="loading" @edit="openEdit" @delete="handleDelete" />

    <RoleDialog
      v-model="dialogOpen"
      :role="editingRole"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>
