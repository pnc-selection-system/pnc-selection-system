<script setup lang="ts">
import EmptyState from './EmptyState.vue'

const props = withDefaults(
  defineProps<{
    data: any[]
    loading?: boolean
    emptyText?: string
    emptyDescription?: string
    highlightCurrent?: boolean
    rowKey?: string
    currentRowKey?: string | number
    bordered?: boolean
  }>(),
  {
    bordered: true,
  },
)

const emit = defineEmits<{
  'row-click': [row: any, column: any, event: Event]
  'current-change': [currentRow: any, oldCurrentRow: any]
}>()

function onRowClick(row: any, column: any, event: Event) {
  emit('row-click', row, column, event)
}

function onCurrentChange(currentRow: any, oldCurrentRow: any) {
  emit('current-change', currentRow, oldCurrentRow)
}
</script>

<template>
  <div
    v-if="bordered"
    class="overflow-hidden rounded border border-slate-200 bg-white relative"
  >
    <div v-if="!data.length" class="flex justify-center items-center py-16">
      <EmptyState
        :title="emptyText || 'No data found'"
        :description="emptyDescription || ''"
      />
    </div>
    <el-table
      v-else
      :data="data"
      :highlight-current-row="highlightCurrent"
      :row-key="rowKey"
      :current-row-key="currentRowKey"
      size="small"
      style="width: 100%"
      @row-click="onRowClick"
      @current-change="onCurrentChange"
    >
      <slot />
    </el-table>
  </div>

  <!-- Unbordered (nested) mode -->
  <template v-else>
    <div v-if="!data.length" class="flex justify-center items-center py-16">
      <EmptyState
        :title="emptyText || 'No data found'"
        :description="emptyDescription || ''"
      />
    </div>
    <el-table
      v-else
      :data="data"
      :highlight-current-row="highlightCurrent"
      :row-key="rowKey"
      :current-row-key="currentRowKey"
      size="small"
      style="width: 100%"
      @row-click="onRowClick"
      @current-change="onCurrentChange"
    >
      <slot />
    </el-table>
  </template>
</template>

<style scoped>
.el-table {
  --el-table-border-color: #e2e8f0;
  --el-table-header-bg-color: #f8fafc;
  --el-table-tr-bg-color: #ffffff;
  --el-table-row-hover-bg-color: #eff6ff;
  --el-table-current-row-bg-color: #eff6ff;
  --el-table-header-text-color: #94a3b8;
  --el-table-text-color: #334155;
  font-size: 12px;
  border: none;
}
.el-table :deep(th.el-table__cell) {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
}
.el-table :deep(td.el-table__cell) {
  padding: 8px 16px;
  border-bottom: 1px solid #e2e8f0;
}
.el-table :deep(.el-table__body tr) {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.el-table :deep(.el-table__body tr:last-child) {
  border-bottom: none;
}

.el-table :deep(.cell) {
  line-height: 1.4;
}
</style>
