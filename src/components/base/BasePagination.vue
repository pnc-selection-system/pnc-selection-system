<script setup lang="ts">
defineProps<{
  currentPage: number
  total: number
  pageSize?: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()
</script>

<template>
  <div class="flex items-center justify-end px-4 py-3 border-t border-slate-200 bg-white rounded-b">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize ?? 10"
      :total="total"
      size="small"
      background
      layout="prev, pager, next"
      @current-change="emit('update:currentPage', $event)"
    />
  </div>
</template>

<style scoped>
.el-pagination {
  --el-pagination-font-size: 12px;
  --el-pagination-button-width: 28px;
  --el-pagination-button-height: 28px;
  --el-pagination-border-radius: 4px;
  font-weight: 500;
}
</style>
