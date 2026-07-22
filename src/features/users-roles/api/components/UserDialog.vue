<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Role } from '../../types/role'
import type { User, UserCreatePayload, UserUpdatePayload } from '../../types/user'
import { PERMISSION_GROUPS } from '../../types/role'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps<{
  modelValue: boolean
  user?: User | null
  roles: Role[]
  submitting?: boolean
  viewOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: UserCreatePayload | UserUpdatePayload): void
}>()

const form = reactive({
  username: '',
  email: '',
  fullName: '',
  password: '',
  roleIds: [] as string[],
  isActive: true,
})

const errors = reactive({ username: '', email: '', fullName: '', password: '' })

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      errors.username = ''
      errors.email = ''
      errors.fullName = ''
      errors.password = ''
      form.username = props.user?.username ?? ''
      form.email = props.user?.email ?? ''
      form.fullName = props.user?.fullName ?? ''
      form.password = ''
      form.roleIds = props.user?.roleIds ? [...props.user.roleIds] : []
      form.isActive = props.user?.isActive ?? true
    }
  },
)

function validate() {
  errors.username = form.username.trim() ? '' : 'Username is required.'
  errors.email = form.email.trim() ? '' : 'Email is required.'
  errors.fullName = form.fullName.trim() ? '' : 'Full name is required.'
  if (!props.user) {
    errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  }
  return !errors.username && !errors.email && !errors.fullName && !errors.password
}

function handleSubmit() {
  if (!validate()) return
  if (props.user) {
    emit('submit', { username: form.username, email: form.email, fullName: form.fullName, roleIds: form.roleIds, isActive: form.isActive } as UserUpdatePayload)
  } else {
    emit('submit', { username: form.username, email: form.email, fullName: form.fullName, password: form.password, roleIds: form.roleIds, isActive: form.isActive } as UserCreatePayload)
  }
}

function close() {
  emit('update:modelValue', false)
}

const title = computed(() => {
  if (props.viewOnly) return 'View User'
  return props.user ? 'Edit User' : 'New User'
})

function userRoles(user: User) {
  return props.roles.filter((r) => user.roleIds.includes(r.id))
}

function groupedPermissions(role: Role) {
  return PERMISSION_GROUPS
    .map((g) => ({
      group: g.group,
      perms: g.permissions.filter((p) => role.permissions.includes(p.key)),
    }))
    .filter((g) => g.perms.length > 0)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    width="560px"
    destroy-on-close
    @update:model-value="close"
  >
    <!-- View Mode -->
    <div v-if="viewOnly && user" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Username</p>
          <p class="text-sm text-slate-800 font-medium">{{ user.username }}</p>
        </div>
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name</p>
          <p class="text-sm text-slate-800">{{ user.fullName }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Email</p>
          <p class="text-sm text-slate-800">{{ user.email }}</p>
        </div>
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</p>
          <BaseBadge :type="user.isActive ? 'primary' : 'info'" size="small">
            {{ user.isActive ? 'Active' : 'Inactive' }}
          </BaseBadge>
        </div>
      </div>

      <!-- Roles & Permissions -->
      <div>
        <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-2">Roles & Permissions</p>
        <div v-if="!user.roleIds.length" class="text-sm text-slate-400">No roles assigned</div>
        <div v-else class="space-y-3 max-h-64 overflow-y-auto pr-1">
          <div
            v-for="role in userRoles(user)"
            :key="role.id"
            class="border border-slate-200 rounded-lg p-3"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-semibold text-slate-800">{{ role.name }}</span>
              <span v-if="role.isSystem" class="text-[10px] border border-gray-300 rounded px-1.5 py-0.5 text-gray-500">system</span>
              <span v-else class="text-[10px] border border-blue-200 rounded px-1.5 py-0.5 text-blue-600">custom</span>
            </div>
            <p v-if="role.description" class="text-xs text-slate-500 mb-2">{{ role.description }}</p>
            <div class="space-y-1.5">
              <div v-for="g in groupedPermissions(role)" :key="g.group">
                <p class="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{{ g.group }}</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="perm in g.perms"
                    :key="perm.key"
                    class="inline-block bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-[11px]"
                  >
                    {{ perm.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Mode -->
    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <BaseInput v-model="form.username" label="Username *" placeholder="Enter username" />
          <p v-if="errors.username" class="mt-1 text-xs text-red-500">{{ errors.username }}</p>
        </div>
        <div>
          <BaseInput v-model="form.fullName" label="Full Name *" placeholder="Enter full name" />
          <p v-if="errors.fullName" class="mt-1 text-xs text-red-500">{{ errors.fullName }}</p>
        </div>
      </div>
      <div>
        <BaseInput v-model="form.email" label="Email *" type="email" placeholder="Enter email address" />
        <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
      </div>
      <div v-if="!user">
        <BaseInput v-model="form.password" label="Password *" type="password" placeholder="Min. 8 characters" />
        <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
      </div>
      <div>
        <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-2">Roles</p>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="role in roles"
            :key="role.id"
            class="flex items-center gap-2 cursor-pointer border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition"
            :class="{ 'border-blue-400 bg-blue-50 text-blue-700': form.roleIds.includes(role.id) }"
          >
            <input type="checkbox" :value="role.id" v-model="form.roleIds" class="hidden" />
            {{ role.name }}
          </label>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
          :class="form.isActive ? 'bg-blue-500' : 'bg-slate-300'"
          @click="form.isActive = !form.isActive"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
            :class="form.isActive ? 'translate-x-4' : 'translate-x-0.5'"
          />
        </button>
        <span class="text-sm text-slate-700">{{ form.isActive ? 'Active' : 'Inactive' }}</span>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="secondary" class="!w-auto !rounded !px-4 !py-2 text-sm font-medium" @click="close">
          {{ viewOnly ? 'Close' : 'Cancel' }}
        </BaseButton>
        <BaseButton
          v-if="!viewOnly"
          variant="primary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          :loading="submitting"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ user ? 'Save Changes' : 'Create User' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
