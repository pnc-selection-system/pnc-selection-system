<script setup lang="ts">
withDefaults(
  defineProps<{
    showEdit?: boolean
    showView?: boolean
    editLabel?: string
    viewLabel?: string
  }>(),
  {
    showEdit: true,
    showView: true,
    editLabel: 'Edit',
    viewLabel: 'View',
  },
)

const emit = defineEmits<{
  edit: []
  view: []
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
    <slot />
  </div>
</template>
