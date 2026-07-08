<script setup lang="ts">
withDefaults(
  defineProps<{
    name: 'warning' | 'delete' | 'plus' | 'edit' | 'search'
    size?: number
    color?: string
    strokeWidth?: number
  }>(),
  {
    size: 16,
    color: 'currentColor',
    strokeWidth: 1.5,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- Warning / Alert triangle -->
    <template v-if="name === 'warning'">
      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </template>

    <!-- Delete / Trash -->
    <template v-if="name === 'delete'">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </template>

    <!-- Plus / Add -->
    <template v-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>

    <!-- Edit / Pencil -->
    <template v-if="name === 'edit'">
      <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </template>

    <!-- Search / Magnifying glass -->
    <template v-if="name === 'search'">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </template>
  </svg>
</template>
