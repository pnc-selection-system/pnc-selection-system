<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Role, RoleCreatePayload, RoleUpdatePayload } from '../../types/role'
import { PERMISSION_GROUPS } from '../../types/role'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps<{
  modelValue: boolean
  role?: Role | null
  submitting?: boolean
  viewOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: RoleCreatePayload | RoleUpdatePayload): void
}>()

const form = reactive({
  name: '',
  description: '',
  permissions: [] as string[],
})

const errors = reactive({ name: '' })

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      errors.name = ''
      form.name = props.role?.name ?? ''
      form.description = props.role?.description ?? ''
      form.permissions = props.role?.permissions ? [...props.role.permissions] : []
    }
  },
)

function isGroupAllSelected(keys: string[]) {
  return keys.every((k) => form.permissions.includes(k))
}

function toggleGroup(keys: string[]) {
  if (isGroupAllSelected(keys)) {
    form.permissions = form.permissions.filter((p) => !keys.includes(p))
  } else {
    keys.forEach((k) => { if (!form.permissions.includes(k)) form.permissions.push(k) })
  }
}

function validate() {
  errors.name = form.name.trim() ? '' : 'Role name is required.'
  return !errors.name
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    name: form.name,
    description: form.description,
    permissions: form.permissions,
  })
}

function close() {
  emit('update:modelValue', false)
}

const title = computed(() => {
  if (props.viewOnly) return 'View Role'
  return props.role ? 'Edit Role' : 'New Role'
})
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    width="620px"
    destroy-on-close
    @update:model-value="close"
  >
    <!-- View Mode -->
    <div v-if="viewOnly && role" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Role Name</p>
          <p class="text-sm text-slate-800 font-medium">{{ role.name }}</p>
        </div>
        <div>
          <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Type</p>
          <span v-if="role.isSystem" class="text-xs border border-gray-300 rounded px-2 py-0.5 text-gray-500">System</span>
          <span v-else class="text-xs border border-blue-200 rounded px-2 py-0.5 text-blue-600">Custom</span>
        </div>
      </div>
      <div v-if="role.description">
        <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</p>
        <p class="text-sm text-slate-700">{{ role.description }}</p>
      </div>
      <div>
        <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-2">Permissions</p>
        <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
          <template v-for="group in PERMISSION_GROUPS" :key="group.group">
            <div v-if="group.permissions.some(p => role!.permissions.includes(p.key))">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{{ group.group }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="perm in group.permissions.filter(p => role!.permissions.includes(p.key))"
                  :key="perm.key"
                  class="inline-block bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs"
                >
                  {{ perm.label }}
                </span>
              </div>
            </div>
          </template>
          <p v-if="!role.permissions.length" class="text-sm text-slate-400">No permissions assigned</p>
        </div>
      </div>
    </div>

    <!-- Create / Edit Mode -->
    <form v-else class="space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <BaseInput
            v-model="form.name"
            label="Role Name *"
            placeholder="e.g. Manager"
            :disabled="role?.isSystem ?? false"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>
        <div>
          <BaseInput
            v-model="form.description"
            label="Description"
            placeholder="Short description"
          />
        </div>
      </div>

      <div>
        <p class="text-[0.6rem] font-semibold uppercase tracking-wider text-slate-400 mb-2">Permissions</p>
        <div class="space-y-3 max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-3">
          <div v-for="group in PERMISSION_GROUPS" :key="group.group">
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{{ group.group }}</p>
              <button
                type="button"
                class="text-[10px] text-blue-500 hover:text-blue-700 transition"
                @click="toggleGroup(group.permissions.map(p => p.key))"
              >
                {{ isGroupAllSelected(group.permissions.map(p => p.key)) ? 'Deselect all' : 'Select all' }}
              </button>
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <label
                v-for="perm in group.permissions"
                :key="perm.key"
                class="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition border border-transparent"
                :class="{ 'border-blue-300 bg-blue-50 text-blue-700': form.permissions.includes(perm.key) }"
              >
                <input type="checkbox" :value="perm.key" v-model="form.permissions" class="hidden" />
                <span
                  class="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition"
                  :class="form.permissions.includes(perm.key) ? 'bg-blue-500 border-blue-500' : 'border-slate-300'"
                >
                  <svg v-if="form.permissions.includes(perm.key)" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {{ perm.label }}
              </label>
            </div>
            <div class="border-b border-slate-100 mt-2" />
          </div>
        </div>
        <p class="mt-1 text-xs text-slate-400">{{ form.permissions.length }} permission(s) selected</p>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton
          variant="secondary"
          class="!w-auto !rounded !px-4 !py-2 text-sm font-medium"
          @click="close"
        >
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
          {{ role ? 'Save Changes' : 'Create Role' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
