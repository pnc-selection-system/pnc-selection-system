<script setup lang="ts">
import BaseButton from '../../../components/base/BaseButton.vue'
import BaseIcon from '../../../components/base/BaseIcon.vue'
import DataTableWrapper from '@/components/ui/DataTableWrapper.vue'
import type { ContactPerson } from '../types/partner'

defineProps<{
  contacts: ContactPerson[]
}>()

const emit = defineEmits<{
  addContact: []
}>()
</script>

<template>
  <div class="border-t border-slate-100">
    <div class="flex items-center justify-between px-4 py-2">
      <p class="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-400">
        Contact Persons
      </p>
      <BaseButton
        variant="primary"
        class="!w-auto !rounded-[4px] !px-3 !py-1.5 text-xs font-semibold"
        @click="emit('addContact')"
      >
        <BaseIcon :size="12" :stroke-width="2.5">
          <path d="M12 5v14M5 12h14" />
        </BaseIcon>
        Add Contact
      </BaseButton>
    </div>

    <DataTableWrapper
      :data="contacts"
      row-key="id"
      empty-text="No contacts yet"
      empty-description="Add contact persons linked to this partner."
    >
      <el-table-column label="Name" min-width="160">
        <template #default="{ row }">
          <span class="text-[13px] text-[#2D3748]">{{ row.full_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role" min-width="120">
        <template #default="{ row }">
          <span class="text-[12px] text-slate-500">{{ row.role || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" min-width="140">
        <template #default="{ row }">
          <span class="text-[12px] text-slate-500">{{ row.phone || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" min-width="180">
        <template #default="{ row }">
          <span class="text-[12px] text-slate-500">{{ row.email || '-' }}</span>
        </template>
      </el-table-column>
    </DataTableWrapper>
  </div>
</template>
