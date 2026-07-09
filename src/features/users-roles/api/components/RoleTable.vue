<script setup lang="ts">
import type { Role } from '../../types/role'

defineProps<{
  roles: Role[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', role: Role): void
  (e: 'delete', role: Role): void
}>()
</script>

<template>
  <table class="role-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Permissions</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="4">Loading…</td>
      </tr>
      <tr v-else-if="roles.length === 0">
        <td colspan="4">No roles found</td>
      </tr>
      <tr v-for="role in roles" :key="role.id">
        <td>
          {{ role.name }}
          <span v-if="role.isSystem" class="system-badge">system</span>
        </td>
        <td>{{ role.description }}</td>
        <td>
          <span v-for="perm in role.permissions" :key="perm" class="perm-chip">
            {{ perm }}
          </span>
        </td>
        <td class="actions">
          <button type="button" @click="emit('edit', role)">Edit</button>
          <button type="button" :disabled="role.isSystem" @click="emit('delete', role)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.role-table {
  width: 100%;
  border-collapse: collapse;
}
.role-table th,
.role-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
.system-badge {
  margin-left: 6px;
  font-size: 11px;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 1px 4px;
}
.perm-chip {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  border-radius: 4px;
  padding: 2px 6px;
  margin: 2px;
  font-size: 12px;
}
.actions button {
  margin-right: 6px;
}
</style>
