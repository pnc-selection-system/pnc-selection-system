<script setup lang="ts">
import type { User } from '../../types/user'

defineProps<{
  users: User[]
  loading?: boolean
  roleNameFor?: (id: string) => string
}>()

const emit = defineEmits<{
  (e: 'edit', user: User): void
  (e: 'delete', user: User): void
}>()
</script>

<template>
  <table class="user-table">
    <thead>
      <tr>
        <th>Username</th>
        <th>Full name</th>
        <th>Email</th>
        <th>Roles</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="6">Loading…</td>
      </tr>
      <tr v-else-if="users.length === 0">
        <td colspan="6">No users found</td>
      </tr>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.username }}</td>
        <td>{{ user.fullName }}</td>
        <td>{{ user.email }}</td>
        <td>
          <span v-for="roleId in user.roleIds" :key="roleId" class="role-chip">
            {{ roleNameFor ? roleNameFor(roleId) : roleId }}
          </span>
        </td>
        <td>
          <span :class="['status-badge', user.isActive ? 'active' : 'inactive']">
            {{ user.isActive ? 'Active' : 'Inactive' }}
          </span>
        </td>
        <td class="actions">
          <button type="button" @click="emit('edit', user)">Edit</button>
          <button type="button" @click="emit('delete', user)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th,
.user-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
.role-chip {
  display: inline-block;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 4px;
  font-size: 12px;
}
.status-badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.status-badge.active {
  background: #dcfce7;
  color: #166534;
}
.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}
.actions button {
  margin-right: 6px;
}
</style>
