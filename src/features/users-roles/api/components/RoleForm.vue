<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Permission } from '../../types/role'
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '../../types/role'

const AVAILABLE_PERMISSIONS: Permission[] = [
  { id: 'p-1', key: 'users:read', label: 'View users' },
  { id: 'p-2', key: 'users:write', label: 'Manage users' },
  { id: 'p-3', key: 'roles:read', label: 'View roles' },
  { id: 'p-4', key: 'roles:write', label: 'Manage roles' },
]

const props = defineProps<{
  role?: Role | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: RoleCreatePayload | RoleUpdatePayload): void
  (e: 'cancel'): void
}>()

const form = reactive({
  name: '',
  description: '',
  permissions: [] as string[],
})

watch(
  () => props.role,
  (role) => {
    form.name = role?.name ?? ''
    form.description = role?.description ?? ''
    form.permissions = role?.permissions ? [...role.permissions] : []
  },
  { immediate: true },
)

function handleSubmit() {
  const payload = {
    name: form.name,
    description: form.description,
    permissions: form.permissions,
  }
  emit('submit', payload)
}
</script>

<template>
  <form class="role-form" @submit.prevent="handleSubmit">
    <label>
      Name
      <input v-model="form.name" type="text" required :disabled="role?.isSystem" />
    </label>

    <label>
      Description
      <textarea v-model="form.description" rows="2" />
    </label>

    <fieldset>
      <legend>Permissions</legend>
      <label v-for="perm in AVAILABLE_PERMISSIONS" :key="perm.id" class="checkbox">
        <input type="checkbox" :value="perm.key" v-model="form.permissions" />
        {{ perm.label }}
      </label>
    </fieldset>

    <div class="form-actions">
      <button type="button" :disabled="submitting" @click="emit('cancel')">Cancel</button>
      <button type="submit" :disabled="submitting">
        {{ role ? 'Save changes' : 'Create role' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.role-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.role-form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.role-form label.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
fieldset {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
