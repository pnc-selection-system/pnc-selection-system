<script setup lang="ts">
import type { User } from '../../types/user'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import FormAction from '@/components/ui/FormAction.vue'

defineProps<{
  users: User[]
  loading?: boolean
  roleNameFor?: (id: string) => string
}>()

const emit = defineEmits<{
  (e: 'edit', user: User): void
  (e: 'view', user: User): void
  (e: 'delete', user: User): void
}>()
</script>

<template>
  <DataTableWrapper
    :data="users"
    :loading="loading"
    empty-text="No users found"
    empty-description="Try adjusting your search criteria"
  >
    <el-table-column label="Username" min-width="120">
      <template #default="{ row }">
        <span class="text-xs font-medium text-slate-900">{{ row.username }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Full Name" min-width="150">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.fullName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Email" min-width="180">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.email }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Roles" min-width="160">
      <template #default="{ row }">
        <span
          v-for="roleId in row.roleIds"
          :key="roleId"
          class="inline-block bg-indigo-50 text-indigo-700 rounded px-2 py-0.5 text-[11px] mr-1"
        >
          {{ roleNameFor ? roleNameFor(roleId) : roleId }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="Status" width="110">
      <template #default="{ row }">
        <BaseBadge :type="row.isActive ? 'primary' : 'info'" size="small">
          {{ row.isActive ? 'Active' : 'Inactive' }}
        </BaseBadge>
      </template>
    </el-table-column>
    <el-table-column label="Actions" width="160" fixed="right">
      <template #default="{ row }">
        <div class="flex items-center gap-1">
          <FormAction @edit="emit('edit', row)" @view="emit('view', row)" />
          <button
            class="rounded px-2.5 py-1.5 text-[11px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
            @click.stop="emit('delete', row)"
          >
            Delete
          </button>
        </div>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>
