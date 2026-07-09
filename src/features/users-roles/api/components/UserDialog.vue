<script setup lang="ts">
import UserForm from './UserForm.vue'
import type { Role } from '../../types/role'
import type { User, UserCreatePayload, UserUpdatePayload } from '../../types/user'

const props = defineProps<{
  modelValue: boolean
  user?: User | null
  roles: Role[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: UserCreatePayload | UserUpdatePayload): void
}>()

function close() {
  emit('update:modelValue', false)
}

function handleSubmit(payload: UserCreatePayload | UserUpdatePayload) {
  emit('submit', payload)
}
</script>

<template>
  <div v-if="modelValue" class="dialog-backdrop" @click.self="close">
    <div class="dialog">
      <header class="dialog-header">
        <h3>{{ user ? 'Edit user' : 'New user' }}</h3>
        <button type="button" class="close-btn" @click="close">×</button>
      </header>
      <UserForm
        :user="user"
        :roles="roles"
        :submitting="submitting"
        @submit="handleSubmit"
        @cancel="close"
      />
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.dialog {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 420px;
  max-width: 90vw;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}
</style>
