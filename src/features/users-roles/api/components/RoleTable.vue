<script setup lang="ts">
import type { Role } from '../../types/role'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import FormAction from '@/components/ui/FormAction.vue'

defineProps<{
  roles: Role[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', role: Role): void
  (e: 'view', role: Role): void
  (e: 'delete', role: Role): void
}>()
</script>

<template>
  <DataTableWrapper
    :data="roles"
    :loading="loading"
    empty-text="No roles found"
    empty-description="Try adjusting your search criteria"
  >
    <el-table-column label="Name" min-width="140">
      <template #default="{ row }">
        <span class="text-xs font-medium text-slate-900">{{ row.name }}</span>
        <span v-if="row.isSystem" class="ml-2 text-[10px] text-gray-500 border border-gray-300 rounded px-1">system</span>
      </template>
    </el-table-column>
    <el-table-column label="Description" min-width="200">
      <template #default="{ row }">
        <span class="text-xs text-slate-700">{{ row.description }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Permissions" min-width="220">
      <template #default="{ row }">
        <span
          v-for="perm in row.permissions"
          :key="perm"
          class="inline-block bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-[11px] mr-1 mb-1"
        >
          {{ perm }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="Actions" width="160" fixed="right">
      <template #default="{ row }">
        <div class="flex items-center gap-1">
          <FormAction @edit="emit('edit', row)" @view="emit('view', row)" />
          <button
            class="rounded px-2.5 py-1.5 text-[11px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="row.isSystem"
            @click.stop="emit('delete', row)"
          >
            Delete
          </button>
        </div>
      </template>
    </el-table-column>
  </DataTableWrapper>
</template>
