<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
    <p class="text-sm text-gray-600">Page {{ page }} of {{ totalPages }}</p>
    <div class="flex gap-2">
      <button
        @click="$emit('change', page - 1)"
        :disabled="page <= 1"
        class="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
      >
        ← Prev
      </button>
      <button
        v-for="p in totalPages"
        :key="p"
        @click="$emit('change', p)"
        :class="['px-3 py-1 text-sm rounded-lg transition', p === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50']"
      >
        {{ p }}
      </button>
      <button
        @click="$emit('change', page + 1)"
        :disabled="page >= totalPages"
        class="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ page: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()
</script>
