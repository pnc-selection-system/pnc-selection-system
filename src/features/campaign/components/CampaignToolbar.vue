<script setup lang="ts">
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'

const yearFilter = defineModel<string>('yearFilter', { required: true })
const statusFilter = defineModel<string>('statusFilter', { required: true })

defineProps<{
  yearOptions: string[]
}>()

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-wrap items-center gap-3">
      <div class="min-w-[160px] max-w-[240px]">
        <BaseSelect
          v-model="yearFilter"
          :options="[
            { value: 'all', label: 'Year: All' },
            ...yearOptions.map(y => ({ value: y, label: `Year: ${y}` })),
          ]"
          clearable
          placeholder="Year"
        />
      </div>
      <div class="min-w-[160px] max-w-[240px]">
        <BaseSelect
          v-model="statusFilter"
          :options="[
            { value: 'all', label: 'Status: All' },
            { value: 'Active', label: 'Status: Active' },
            { value: 'Closed', label: 'Status: Closed' },
          ]"
          clearable
          placeholder="Status"
        />
      </div>
    </div>
    <BaseButton
      variant="primary"
      class="!w-auto !rounded-[4px] !px-4 !py-2 text-sm font-semibold"
      @click="emit('create')"
    >
      <BaseIcon name="plus" :size="14" :stroke-width="2.5" />
      New campaign
    </BaseButton>
  </div>
</template>
