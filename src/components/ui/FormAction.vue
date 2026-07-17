<script setup lang="ts">
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
    <button
      v-if="showEdit"
      class="rounded px-2.5 py-1.5 text-[11px] font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
      @click.stop="emit('edit')"
    >
      {{ editLabel }}
    </button>
    <button
      v-if="showView"
      class="rounded px-2.5 py-1.5 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
      @click.stop="emit('view')"
    >
      {{ viewLabel }}
    </button>
    <button
      v-if="showDelete"
      class="rounded px-2.5 py-1.5 text-[11px] font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
      @click.stop="emit('delete')"
    >
      {{ deleteLabel }}
    </button>
    <slot />
  </div>
</template>
