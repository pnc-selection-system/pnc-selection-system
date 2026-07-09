<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Role } from '../../types/role'
import type { User, UserCreatePayload, UserUpdatePayload } from '../../types/user'

const props = defineProps<{
  user?: User | null
  roles: Role[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: UserCreatePayload | UserUpdatePayload): void
  (e: 'cancel'): void
}>()

const form = reactive({
  username: '',
  email: '',
  fullName: '',
  password: '',
  roleIds: [] as string[],
  isActive: true,
})

watch(
  () => props.user,
  (user) => {
    form.username = user?.username ?? ''
    form.email = user?.email ?? ''
    form.fullName = user?.fullName ?? ''
    form.password = ''
    form.roleIds = user?.roleIds ? [...user.roleIds] : []
    form.isActive = user?.isActive ?? true
  },
  { immediate: true },
)

function handleSubmit() {
  if (props.user) {
    const payload: UserUpdatePayload = {
      username: form.username,
      email: form.email,
      fullName: form.fullName,
      roleIds: form.roleIds,
      isActive: form.isActive,
    }
    emit('submit', payload)
  } else {
    const payload: UserCreatePayload = {
      username: form.username,
      email: form.email,
      fullName: form.fullName,
      password: form.password,
      roleIds: form.roleIds,
      isActive: form.isActive,
    }
    emit('submit', payload)
  }
}
</script>

<template>
  <form class="user-form" @submit.prevent="handleSubmit">
    <label>
      Username
      <input v-model="form.username" type="text" required />
    </label>

    <label>
      Full name
      <input v-model="form.fullName" type="text" required />
    </label>

    <label>
      Email
      <input v-model="form.email" type="email" required />
    </label>

    <label v-if="!user">
      Password
      <input v-model="form.password" type="password" required minlength="8" />
    </label>

    <label>
      Roles
      <select v-model="form.roleIds" multiple>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
    </label>

    <label class="checkbox">
      <input v-model="form.isActive" type="checkbox" />
      Active
    </label>

    <div class="form-actions">
      <button type="button" :disabled="submitting" @click="emit('cancel')">Cancel</button>
      <button type="submit" :disabled="submitting">
        {{ user ? 'Save changes' : 'Create user' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.user-form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.user-form label.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
</style>
