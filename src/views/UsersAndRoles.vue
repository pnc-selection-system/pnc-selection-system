<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <PageHeader breadcrumb="Setup / Users &amp; Roles" title="Users &amp; roles">
          <button @click="openAddUserDialog"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            + Add user
          </button>
        </PageHeader>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Filter Tabs -->
      <div class="mb-6 flex gap-4 items-center border-b border-gray-300 pb-4">
        <span class="text-sm font-semibold text-gray-700 uppercase">Roles</span>
        <button v-for="role in roleFilters" :key="role" @click="selectedRole = selectedRole === role ? null : role"
          :class="[
            'px-3 py-1 text-sm font-medium rounded transition',
            selectedRole === role
              ? 'bg-gray-400 text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-100',
          ]">
          {{ role }}
        </button>
        <span class="ml-auto text-sm font-semibold text-gray-700 uppercase">Reqs</span>
        <button class="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded transition">
          FR-SEC
        </button>
        <span class="text-sm font-semibold text-gray-700 uppercase">RBAC matrix</span>
      </div>

      <!-- Search and Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Users Table -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <!-- Search Box -->
            <div class="border-b border-gray-200 p-6">
              <BaseInput v-model="searchQuery" placeholder="Search users..." />
            </div>

            <!-- Users Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Name</th>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Email</th>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Role</th>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Status</th>
                    <th class="text-center py-4 px-6 font-semibold text-gray-700 uppercase text-xs">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id"
                    class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                          getUserAvatarColor(user.role),
                        ]">
                          {{ getInitials(user.name) }}
                        </div>
                        <span class="text-gray-900 font-medium">{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-gray-600">{{ user.email }}</td>
                    <td class="py-4 px-6">
                      <BaseBadge :type="getRoleBadgeType(user.role)" size="small">
                        {{ user.role }}
                      </BaseBadge>
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-2">
                        <BaseBadge :type="getUserStatusBadgeType(user.status)" size="small">
                          {{ user.status }}
                        </BaseBadge>
                        <span v-if="user.status === 'Active'" class="text-green-600">●</span>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-center relative">
                      <button @click.stop="toggleMenu(user.id)" class="text-gray-400 hover:text-gray-600 transition">
                        ⋯
                      </button>
                      <div v-if="openMenuId === user.id"
                        class="absolute right-6 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                        <button @click="openEditDialog(user)"
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
                          ✏️ Edit
                        </button>
                        <button @click="confirmDelete(user)"
                          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - Permission Matrix -->
        <div>
          <PermissionMatrix :permissions="permissions" />
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit User Dialog -->
  <AddUserDialog
    :isOpen="showAddUserDialog"
    :editUser="editingUser"
    @close="closeAddUserDialog"
    @submit="handleAddUser"
  />

  <!-- Confirm Delete Dialog -->
  <ConfirmDialog
    :isOpen="!!deletingUser"
    title="Delete User"
    :message="`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone.`"
    @confirm="handleDeleteUser"
    @cancel="deletingUser = null"
  />
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { users as initialUsers, permissions } from '../features/users-roles/usersData'
import type { User } from '../features/users-roles/types'
import PermissionMatrix from '../components/ui/PermissionMatrix.vue'
import AddUserDialog from '../components/ui/AddUserDialog.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'

const searchQuery = ref('')
const selectedRole = ref<string | null>(null)
const showAddUserDialog = ref(false)
const editingUser = ref<User | null>(null)
const deletingUser = ref<User | null>(null)
const openMenuId = ref<string | null>(null)

const users = reactive([...initialUsers])

const roleFilters = ['Super Admin only']

const filteredUsers = computed(() =>
  users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    return matchesSearch && matchesRole
  }),
)

const getRoleBadgeType = (role: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' => {
  const colors: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    'Selection Manager': 'primary',
    'Selection Officer': 'success',
    Investigator: 'warning',
    Committee: 'danger',
    Officer: 'info',
  }
  return colors[role] || 'info'
}

const getUserAvatarColor = (role: string) => {
  const colors: Record<string, string> = {
    'Selection Manager': 'bg-blue-600',
    'Selection Officer': 'bg-cyan-600',
    Investigator: 'bg-orange-600',
    Committee: 'bg-purple-600',
    Officer: 'bg-slate-600',
  }
  return colors[role] || 'bg-gray-600'
}

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

const getUserStatusBadgeType = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'primary' => {
  const colors: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'primary'> = {
    Active: 'success',
    Invited: 'warning',
    Deactivated: 'danger',
  }
  return colors[status] || 'info'
}

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const openAddUserDialog = () => {
  editingUser.value = null
  showAddUserDialog.value = true
}

const closeAddUserDialog = () => {
  showAddUserDialog.value = false
  editingUser.value = null
}

const openEditDialog = (user: User) => {
  editingUser.value = { ...user }
  openMenuId.value = null
  showAddUserDialog.value = true
}

const confirmDelete = (user: User) => {
  deletingUser.value = user
  openMenuId.value = null
}

const handleDeleteUser = () => {
  if (!deletingUser.value) return
  const idx = users.findIndex((u) => u.id === deletingUser.value!.id)
  if (idx !== -1) users.splice(idx, 1)
  deletingUser.value = null
}

const handleAddUser = (newUser: { id?: string; name: string; email: string; role: string; status: string }) => {
  const role = newUser.role as User['role']
  const status = newUser.status as User['status']
  if (newUser.id) {
    const idx = users.findIndex((u) => u.id === newUser.id)
    if (idx !== -1) users[idx] = { id: newUser.id, name: newUser.name, email: newUser.email, role, status }
  } else {
    const maxId = Math.max(...users.map((u) => parseInt(u.id)), 0)
    users.push({ id: String(maxId + 1), name: newUser.name, email: newUser.email, role, status })
  }
}
</script>
