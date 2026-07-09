<script setup lang="ts">
import { ref, computed } from 'vue'

const overallPassMark = ref(60)
const perSubjectMin = ref(40)
const mustPassEverySubject = ref(false)

// Live preview sample scores
const sampleScores = ref([78, 71, 80, 30])

const weightedScore = computed(() => {
  const sum = sampleScores.value.reduce((a, b) => a + b, 0)
  return (sum / sampleScores.value.length).toFixed(1)
})

const previewResult = computed(() => {
  const score = parseFloat(weightedScore.value)
  if (mustPassEverySubject.value && sampleScores.value.some((s) => s < perSubjectMin.value)) {
    return 'FAIL'
  }
  return score >= overallPassMark.value ? 'PASS' : 'FAIL'
})

const previewResultColor = computed(() => {
  return previewResult.value === 'PASS'
    ? { bg: '#DCFCE7', text: '#16A34A' }
    : { bg: '#FEE2E2', text: '#DC2626' }
})

function saveConfiguration() {
  // TODO: integrate with API
  alert('Configuration saved!')
}
</script>

<template>
  <div class="rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <h3 class="text-sm font-semibold text-slate-800">Pass / Fail Thresholds</h3>
        <p class="mt-0.5 text-xs text-slate-400">Configure grading thresholds</p>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden">
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50/80">
            <th class="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">Setting</th>
            <th class="px-6 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">Value</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="px-6 py-3.5 text-sm text-slate-700">Overall Pass Mark</td>
            <td class="px-6 py-3.5">
              <div class="inline-flex items-center">
                <input
                  v-model.number="overallPassMark"
                  type="number"
                  min="0"
                  max="100"
                  class="w-16 rounded border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
                <span class="ml-1.5 text-xs text-slate-400">%</span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-3.5 text-sm text-slate-700">Per-Subject Minimum</td>
            <td class="px-6 py-3.5">
              <div class="inline-flex items-center">
                <input
                  v-model.number="perSubjectMin"
                  type="number"
                  min="0"
                  max="100"
                  class="w-16 rounded border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
                <span class="ml-1.5 text-xs text-slate-400">%</span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-3.5 text-sm text-slate-700">Must Pass Every Subject</td>
            <td class="px-6 py-3.5">
              <input
                v-model="mustPassEverySubject"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Live Preview -->
    <div class="border-t border-slate-100 px-6 py-4">
      <h4 class="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">Live Preview</h4>
      <div class="rounded border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Sample {{ sampleScores.join(' / ') }} → weighted
        <span class="font-medium text-slate-800">{{ weightedScore }}</span>
        →
        <span
          class="ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          :style="{
            backgroundColor: previewResultColor.bg,
            color: previewResultColor.text,
          }"
        >
          {{ previewResult }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-slate-100 px-6 py-4">
      <button
        @click="saveConfiguration"
        class="w-full rounded-lg bg-[#3b4a5c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2d3a48]"
      >
        Save configuration
      </button>
    </div>
  </div>
</template>
