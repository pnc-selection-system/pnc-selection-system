<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

withDefaults(
  defineProps<{
    showEdit?: boolean
    showView?: boolean
    showDelete?: boolean
    editLabel?: string
    viewLabel?: string
    deleteLabel?: string
  }>(),
  {
    showEdit: true,
    showView: true,
    showDelete: false,
    editLabel: 'Edit',
    viewLabel: 'View',
    deleteLabel: 'Delete',
  },
)

const emit = defineEmits<{
  edit: []
  view: []
  delete: []
}>()
</script>

<template>
  <div class="flex items-center gap-1">
    <BaseButton
      v-if="showEdit"
      variant="outline"
      size="small"
      class="!rounded !px-2.5 !py-1.5 !text-[11px] font-medium !text-blue-600 hover:!text-blue-700 !border-0 !bg-transparent hover:!bg-blue-50"
      @click.stop="emit('edit')"
    >
      {{ editLabel }}
    </BaseButton>
    <BaseButton
      v-if="showView"
      variant="outline"
      size="small"
      class="!rounded !px-2.5 !py-1.5 !text-[11px] font-medium !text-slate-500 hover:!text-slate-700 !border-0 !bg-transparent hover:!bg-slate-100"
      @click.stop="emit('view')"
    >
      {{ viewLabel }}
    </BaseButton>
    <BaseButton
      v-if="showDelete"
      variant="outline"
      size="small"
      class="!rounded !px-2.5 !py-1.5 !text-[11px] font-medium !text-red-500 hover:!text-red-700 !border-0 !bg-transparent hover:!bg-red-50"
      @click.stop="emit('delete')"
    >
      {{ deleteLabel }}
    </BaseButton>
    <slot />
  </div>
</template>
