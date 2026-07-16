<script setup lang="ts">
import { ReportStatus, reportStatusLabels, reportFormatLabels } from '../types'
import type { Report } from '../types'

defineProps<{
  reports: Report[]
}>()

const emit = defineEmits<{
  download: [id: string]
}>()

function getStatusType(status: ReportStatus): 'success' | 'warning' | 'info' | 'danger' {
  switch (status) {
    case ReportStatus.Ready:
      return 'success'
    case ReportStatus.Processing:
      return 'warning'
    case ReportStatus.Failed:
      return 'danger'
    default:
      return 'info'
  }
}

function getFormatBadge(format: string): string {
  return reportFormatLabels[format as keyof typeof reportFormatLabels] || format
}


</script>

<template>
  <div class="rounded border border-slate-200 bg-white p-6">
    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
      Recent Reports
    </h3>

    <div v-if="reports.length === 0" class="text-center py-8 text-gray-500">
      No reports generated yet.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Report
            </th>
            <th class="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Format
            </th>
            <th class="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th class="text-right py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="report in reports"
            :key="report.id"
            class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-2">
              <span class="text-slate-700">{{ report.name }}</span>
            </td>
            <td class="py-3 px-2">
              <span class="text-slate-600">{{ getFormatBadge(report.format) }}</span>
            </td>
            <td class="py-3 px-2">
              <div class="flex items-center gap-2">
                <BaseBadge :type="getStatusType(report.status)" dot>
                  {{ report.status === ReportStatus.Processing && report.progress
                    ? `Processing… ${report.progress}%`
                    : reportStatusLabels[report.status]
                  }}
                </BaseBadge>
              </div>
            </td>
            <td class="py-3 px-2 text-right">
              <BaseButton
                v-if="report.status === ReportStatus.Ready"
                variant="secondary"
                class="inline-flex items-center gap-1.5"
                @click="emit('download', report.id)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </BaseButton>
              <span v-else-if="report.status === ReportStatus.Processing" class="text-gray-400">
                —
              </span>
              <span v-else-if="report.status === ReportStatus.Failed" class="text-red-500 text-sm">
                Failed
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
